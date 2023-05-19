import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, relative } from 'node:path'

export const cwd = process.cwd()

export const rewrites = {}
export const rewritesReverseMap = {}

const readdir = (p) => readdirSync(p, { withFileTypes: true })

const capitalize = str => str.replace(/^(\w)(.*)$/, (_, $1, $2) => `${$1.toUpperCase()}${$2}`)

const indexMd = 'index.md'

const mdFileRe = /^(.+)\.md$/
const removeMdExt = file => file.replace(mdFileRe, '$1')

const getDefaultContent = name => `# ${name}\n\n<AutoSubLink />\n` 


const traverse = (path, parentPath = cwd) => {
  const realPath = resolve(parentPath, path)
  if (statSync(realPath).isDirectory()) {
    const dirents = readdir(realPath)
    // TODO: exclude special files
    const indexMdFilePath = resolve(realPath, indexMd)
    if (!existsSync(indexMdFilePath)) {
      writeFileSync(indexMdFilePath, getDefaultContent(path))
    }
    return {
      text: path,
      items: dirents.map(item => traverse(item.name, realPath)).filter(Boolean)
    }
  } else {
      const relativePath = relative(cwd, realPath).replace(/(\\)/g, '/')
      if (path === indexMd) {
        // auto redirect from /a/b/xx/ to /a/b/xx
        const value = relativePath.replace(/^(.*)\/index.md$/, '$1.md')
        rewrites[relativePath] = value
        const relativeParentPath = relative(cwd, parentPath).replace(/(\\)/g, '/')
        rewritesReverseMap[value] = readdir(parentPath)
          .filter(item => item.name !== indexMd)
          .map(item => {
            const text = removeMdExt(item.name)
            return {
              text,
              href: `/${relativeParentPath}/${text}`,
            }
          })
        return null
      }
      return {
        text: removeMdExt(path),
        link: `/${relativePath}`,
      }
  }
}

const ignoreDirs = ['.git', 'node_modules', '.vitepress', 'public']

const categories = readdir(cwd)
  .filter(item => item.isDirectory() && !ignoreDirs.includes(item.name))
  .map(item => item.name)
  
export const nav = categories.map(text => ({
  text: capitalize(text),
  activeMatch: `/${text}`,
  link: `/${text}`,
}))

export const sidebar = categories.reduce((res, item) => {
  res[`/${item}`] = traverse(item).items.filter(Boolean)
  return res
}, {})
