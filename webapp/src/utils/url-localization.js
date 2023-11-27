import { generalConfig } from '../config'

export const getLocalePath = (url, newLocale) => {
  let { 0: path, 1: search } = url.split('?')
  const pathLanguage = getLanguageFromPath(path)
  const isDefaultLanguage = generalConfig.defaultLanguage === newLocale

  if (!isDefaultLanguage && pathLanguage === newLocale) return url

  if (pathLanguage) {
    path = path.substring(3)
  }

  return (
    (!isDefaultLanguage ? `/${newLocale}` : '') +
    path +
    (search ? `?${search}` : '')
  )
}

export const getLanguageFromPath = path => {
  const { 0: pathname } = path.split('?')
  const language = pathname.substring(1, 4).replace(/\/$/, '')

  return generalConfig.languages.find(lang => lang === language)
}

export const removeLanguageFromPath = path => {
  const language = getLanguageFromPath(path)

  return language ? path.substring(3) || '/' : path
}

export const localizeRoutes = routes => {
  const languages = generalConfig.languages.filter(
    language => language !== generalConfig.defaultLanguage,
  )

  return routes.concat(
    routes.flatMap(route =>
      route.path === '*'
        ? []
        : languages.map(lang => ({
            ...route,
            path: getLocalePath(route.path, lang),
          })),
    ),
  )
}
