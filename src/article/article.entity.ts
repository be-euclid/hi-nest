export class Article {
    articleID: number;
    userID: number;
    title: string;
    content: string;
  
    constructor(articleId: number, userID: number, title: string, content: string) {
      this.articleID = articleId;
      this.userID = userID;
      this.title = title;
      this.content = content;
    }
  }