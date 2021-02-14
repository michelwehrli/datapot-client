/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default class Templater {
  public static resolve(html: string, values: any): string {
    for (const match of html.match(/\${(.*?)}/g)) {
      const work = match.split('${').join('').split('}').join('')
      html = html.split(match).join(values[work] || '<span>-</span>')
    }
    return html
  }

  public static appendResolve(html: string, values: any) {
    for (const match of html.match(/\${(.*?)}/g)) {
      const work = match.split('${').join('').split('}').join('')
      html = html.split(match).join(`<u class="${work}"></u>`)
    }

    const dummy = document.createElement('div')
    dummy.innerHTML = html

    for (const key of Object.keys(values)) {
      const u = dummy.querySelector(`u.${key}`)
      u.parentNode.replaceChild(values[key], u)
    }

    return dummy.firstChild
  }
}
