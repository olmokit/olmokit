import { uuid } from "@olmokit/utils/uuid";
import { $ } from "@olmokit/dom/$";
import { $each } from "@olmokit/dom/$each";
import { addClass } from "@olmokit/dom/addClass";
import { getDataAttr } from "@olmokit/dom/getDataAttr";
import { on } from "@olmokit/dom/on";
import { setDataAttr } from "@olmokit/dom/setDataAttr";
import { globalConf } from "../../data";

// import { v4 as uuid } from "uuid";

/**
 * Uploader variables
 */
let counter = 0;
let _file: File | string = ""; // not sure how this can be a string
let _totalCount = 0;
let fileGuid = "";
let _fileID = "";
let _fileTreuName = "";
const chunkSize = 1000000; // 1 mb
let chunkCount = 0;
let beginingOfTheChunk = 0;
let endOfTheChunk = chunkSize;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Uploadfile(_rootSelector = ".ofForm:") {
  // const $root = $(rootSelector);
  // const $form = $(".of:", $root);
  // const formid = getDataAttr($form, "id");
  // const data = getDataAttr($form, "action");
  // const instance = {
  //   $root,
  //   $form,
  //   data,
  // };

  $each(".file", ($rootupload) => {
    const $input = $<HTMLInputElement>(".formControl", $rootupload);
    const $fileName = $(".fileName", $rootupload);

    on($input, "change", () => {
      if ($input.files?.length) {
        const file = $input.files[0];
        $fileName.textContent = file.name;

        // const theSize = sizeChecker(file);
        /**
         * Use this for debugging porpuse
         */
        // Uploader(".FormContact:");
      }
    });
  });
}

export function sizeChecker(file: File) {
  const size = file.size;
  const $file = $(".file");
  const sizeLimit = $<HTMLInputElement>(".fileSize", $file).value;
  if (size > parseInt(sizeLimit)) {
    addClass($file, "invalid");
  }
}

export function Uploader(rootSelector: string) {
  const $root = $(rootSelector);
  const $form = $(".of:", $root);
  const formid = getDataAttr($form, "id") as string;
  const $file = $(".file");
  const $input = $(".formControl", $file) as HTMLInputElement;

  return new Promise<number>(function (resolve) {
    const file = $input.files?.[0];

    if (file) {
      createFileContext(file);
      resolve(1);
    }
  })
    .then(function (result) {
      console.log("step", result); // 1

      return new Promise<number>((resolve) => {
        uploadChunk($input, formid).then(() => resolve(result * 2));
      });
    })
    .then(function (result) {
      console.log("step", result); // 2
      return result == 2;
    });
}

const createFileContext = (file: File) => {
  _file = file;
  _totalCount =
    _file.size % chunkSize === 0
      ? _file.size / chunkSize
      : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
  chunkCount = _totalCount;

  _fileID = uuid() + "." + _file.name.split(".").pop();
  _fileTreuName = _file.name;

  fileGuid = _fileID;
};

const uploadChunk = async ($input: HTMLInputElement, formid: string) => {
  const uploadCompleted = async () => {
    try {
      const response = await fetch(
        globalConf.cmsApiUrl +
          "/_/form/uploadcomplete?" +
          new URLSearchParams({
            public: "false",
            fileName: fileGuid,
            trueName: _fileTreuName,
            foldersName: "olmoemail/attachments/form-" + formid + "/",
          }).toString(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = (await response.json()) as {
        isSuccess?: boolean;
        filename: string;
        path: string;
      };
      if (data.isSuccess) {
        console.log("done");
        setDataAttr($input, "filecontent", data.filename);
        setDataAttr($input, "filename", data.path);
        return true;
      }
      return false;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const uploadChunks = async (chunk: string | Blob) => {
    try {
      const response = await fetch(
        globalConf.cmsApiUrl + "/_/form/uploadchunks?fileName=" + fileGuid,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: chunk,
        }
      );
      const data = (await response.json()) as {
        isSuccess?: boolean;
        filename: string;
        path: string;
        errorMessage?: string;
      };
      if (data.isSuccess) {
        beginingOfTheChunk = endOfTheChunk;
        endOfTheChunk = endOfTheChunk + chunkSize;
        if (counter === chunkCount) {
          console.log("Process is complete, counter", counter);
          await uploadCompleted();
        } else {
          // const percentage = (counter / chunkCount) * 100;
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
