<?php

namespace LaravelFrontend\Cacher;

class CacherTags
{
  const data = 'data';

  const structure = 'structure';

  const custom = 'custom';

  const models = 'models';

  const routes = 'routes';

  const forms = 'forms';

  const img = 'img';

  const translations = 'translations';

  public static function model(string $name = '')
  {
    return self::models . '.' . $name;
  }

  public static function route(string $id = '')
  {
    return self::routes . '.' . $id;
  }

  public static function form(string $id = '')
  {
    return self::forms . '.' . $id;
  }

  public static function translation(string $locale = '')
  {
    return self::translations . '.' . $locale;
  }

  // @see https://stackoverflow.com/a/7506608/1938970
  static function tag(string $tagName = '')
  {
    return constant('self::' . $tagName);
  }

  static function exists(string $tagName = '')
  {
    if (constant('self::' . $tagName)) {
      return true;
    }
    return false;
  }
}

// enum CacherTags: string
// {
//     case data = 'data';
//     case structure = 'structure';
//     case custom = 'custom';
//     case models = 'models';
//     case routes = 'routes';
//     case forms = 'forms';

//     public function single(string $idOrName = ''): string
//     {
//         return match ($this) {
//             static::models => "models.$idOrName",
//             static::routes => "routes.$idOrName",
//             static::forms => "forms.$idOrName",
//         };
//     }
// }
