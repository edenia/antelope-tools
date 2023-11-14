import { generalConfig } from '../config'

export const getLocaleUrl = (url, newLocale) => {
  let { 0: path, 1: search } = url.split('?')
  const pathLanguage = getLanguageFromURL(path)

  if (generalConfig.defaultLanguage !== newLocale && pathLanguage === newLocale)
    return url

  if (pathLanguage) {
    path = path.substring(0, path.length - 3)
  }

  return (
    path +
    (/\/$/.test(path) ? '' : '/') +
    (generalConfig.defaultLanguage !== newLocale ? newLocale : '') +
    (search ? `?${search}` : '')
  )
}

export const getLanguageFromURL = path => {
  const { 0: pathname } = path.split('?')
  const language = pathname.substring(pathname.length - 3).replace('/', '')

  return generalConfig.languages.find(lang => lang === language)
}

export const removeLanguageFromURL = path => {
  const language = getLanguageFromURL(path)

  return language ? path.substring(0, path.length - 3) || '/' : path
}

export const localizeRoutes = routes => {
  const languages = generalConfig.languages.filter(
    language => language !== generalConfig.defaultLanguage,
  )

  return routes.concat(
    routes.flatMap(route =>
      route.path === '*'
        ? []
        : languages.map(language => ({
            ...route,
            path:
              route.path === '/' ? '/' + language : route.path + '/' + language,
          })),
    ),
  )
}
