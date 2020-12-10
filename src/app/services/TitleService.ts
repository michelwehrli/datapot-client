export default class TitleService {
  public static setTitle(title: string): void {
    document.querySelector('title').innerText = `${title} – Datapot CRM`
  }
}
