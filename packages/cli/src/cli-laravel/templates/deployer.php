<?php

// this file will be tmeporarily placed inside the /public folder during
// deployment, it will run and then be deleted once it has finished

class Laravel_Scripts_Deployer
{
  const VENDOR = 'vendor';
  const VENDOR_NEW = 'vendor-new';
  const VENDOR_OLD = 'vendor-old';

  function __construct()
  {
    // here the scripts steps:

    // 1: unzip the vendor.zip file uploaded by lftp, only continue if it
    // succeded
    if (self::unzip(self::VENDOR, self::VENDOR_NEW)) {
      // 2: in case there is already an existing vendor folder tmeporarily
      // rename it, first time deploy don't have it so we need this check
      if (self::folderExists(self::VENDOR)) {
        self::renameFolder(self::VENDOR, self::VENDOR_OLD);
      }

      // 3: rename the new unzipped vendor to the actual vendor folder
      self::renameFolder(self::VENDOR_NEW, self::VENDOR);

      // 4: delete the now empty unzip extracting destination
      self::deleteDir(self::getPath(self::VENDOR_NEW));

      // 5: delete the vendor.zip file
      unlink(self::getPath(self::VENDOR . '.zip'));

      // 6: delete the old vendor folder if it exists, it might take few
      // seconds
      if (self::folderExists(self::VENDOR_OLD)) {
        self::deleteDir(self::getPath(self::VENDOR_OLD));
      }

      // 7: suicide, this script auto-deletes itself
      unlink(__FILE__);

      exit('Updated vendor files successfully!');
    }

    exit('Failed to unzip vendor.zip :(');
  }

  /**
   * Get path, we are in the public directory so we need to go 1 level up to
   * be in the project root
   *
   * @param string $path
   * @return string
   */
  private static function getPath($path)
  {
    return dirname(__FILE__, 2) . '/' . $path;
  }

  /**
   * Check that a folder exists
   *
   * @param string $path Relative to the project root
   * @return void
   */
  private static function folderExists($path)
  {
    return file_exists(self::getPath($path)) && is_dir(self::getPath($path));
  }

  /**
   * Rename folder
   *
   * @param string $src Relative to the project root
   * @param string $dest Relative to the project root
   * @return void
   */
  private static function renameFolder($src, $dest)
  {
    rename(self::getPath($src), self::getPath($dest));
  }

  /**
   * Unzip source to given destination path (relative to the root)
   *
   * @param string $src Relative to the project root
   * @param string $dest Relative to the project root
   * @return bool
   */
  private static function unzip($src, $dest)
  {
    $zip = new ZipArchive();

    if ($zip->open(self::getPath($src . '.zip')) === true) {
      $zip->extractTo(self::getPath($dest));
      $zip->close();

      return true;
    }

    return false;
  }

  /**
   * Delete a given directory and all its content
   *
   * @see https://stackoverflow.com/a/11614201/1938970
   * @see https://stackoverflow.com/a/3349792/1938970
   * @param string $dir Pass here an absolute path
   * @return void
   */
  private static function deleteDir($dir)
  {
    if (is_dir($dir)) {
      $objects = scandir($dir);
      foreach ($objects as $object) {
        if ($object != '.' && $object != '..') {
          if (filetype($dir . '/' . $object) == 'dir') {
            self::deleteDir($dir . '/' . $object);
          } else {
            unlink($dir . '/' . $object);
          }
        }
      }
      reset($objects);
      rmdir($dir);
    }
  }
}

new Laravel_Scripts_Deployer();
