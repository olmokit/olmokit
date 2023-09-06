// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import axios from "axios";
import { uuid } from "@olmokit/utils/uuid";
import { $ } from "@olmokit/dom/$";
import { $all } from "@olmokit/dom/$all";
import { addClass } from "@olmokit/dom/addClass";
import { forEach } from "@olmokit/dom/forEach";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { on } from "@olmokit/dom/on";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import { globalConf } from "../../data";

// import { v4 as uuid } from "uuid";

/**
 * Uploader variables
 */
let counter = 0;
let _file = "";
let _size = "";
let _totalCount = 0;
let fileGuid = "";
let _fileID = "";
let _fileTreuName = "";
const chunkSize = 1000000 * 2; //its 3MB
let chunkCount = 0;
let beginingOfTheChunk = 0;
let endOfTheChunk = chunkSize;

export function Uploadfile(rootSelector = ".ofForm:") {
  const $root = $(rootSelector);
  const $form = $(".of:", $root);
  const formid = getDataAttr($form, "id");
  const data = getDataAttr($form, "action");
  const instance = {
    $root,
    $form,
    data,
  };

  forEach($all(".file"), ($rootupload) => {
    const $input = $(".formControl", $rootupload);
    const $fileName = $(".fileName", $rootupload);

    on($input, "change", () => {
      if ($input.files.length) {
        const file = $input.files[0];
        $fileName.textContent = file.name;

        const theSize = sizeChecker(file);
        /**
         * Use this for debugging porpuse
         */
        // Uploader(".FormContact:");
      }
    });
  });
}

export function sizeChecker(file) {
  const size = file.size;
  const $file = $(".file");
  const sizeLimit = $(".fileSize", $file).value;
  if (size > parseInt(sizeLimit)) {
    addClass($file, "invalid");
  }
}

export function Uploader(rootSelector?: string) {
  const $root = $(rootSelector);
  const $form = $(".of:", $root);
  const formid = getDataAttr($form, "id");
  const $file = $(".file");
  const $input = $(".formControl", $file);

  return new Promise(function (resolve, reject) {
    const file = $input.files[0];

    createFileContext(file);
    resolve(1);
  })
    .then(function (result) {
      console.log("step", result); // 1

      return new Promise((resolve, reject) => {
        uploadChunk($input, formid).then(() => resolve(result * 2));
      });
    })
    .then(function (result) {
      console.log("step", result); // 2
      return result == 2;
    });
}

const createFileContext = (file) => {
  _file = file;
  _size = _file.size;
  _totalCount =
    _file.size % chunkSize === 0
      ? _file.size / chunkSize
      : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
  chunkCount = _totalCount;

  _fileID = uuid() + "." + _file.name.split(".").pop();
  _fileTreuName = _file.name;

  fileGuid = _fileID;
};

const uploadChunk = async ($input, formid) => {
  const uploadCompleted = async () => {
    try {
      const response = await axios.post(
        globalConf.cmsApiUrl + "/_/form/uploadcomplete",
        {},
        {
          params: {
            public: "false",
            fileName: fileGuid,
            trueName: _fileTreuName,
            foldersName: "olmoemail/attachments/form-" + formid + "/",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.isSuccess) {
        console.log("done");
        setDataAttr($input, "filecontent", data.filename);
        setDataAttr($input, "filename", data.path);
        return true;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const uploadChunks = async (chunk) => {
    try {
      const response = await axios.post(
        globalConf.cmsApiUrl + "/_/form/uploadchunks?fileName=" + fileGuid,
        chunk,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.isSuccess) {
        beginingOfTheChunk = endOfTheChunk;
        endOfTheChunk = endOfTheChunk + chunkSize;
        if (counter === chunkCount) {
          console.log("Process is complete, counter", counter);
          await uploadCompleted();
        } else {
          const percentage = (counter / chunkCount) * 100;
          await fileUpload();
          // setProgress(percentage);
        }
      } else {
        console.log("Error Occurred:", data.errorMessage);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fileUpload = async () => {
    counter = counter + 1;
    if (counter <= chunkCount) {
      const chunk = _file.slice(beginingOfTheChunk, endOfTheChunk);
      await uploadChunks(chunk);
    }
  };

  await fileUpload();
};
