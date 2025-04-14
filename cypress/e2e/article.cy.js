function generateUser() {
  const id = Math.random().toString(36).substring(2, 10);
  const userName = `test_user_${id}`;
  const email = `${userName}@mail.com`;

  return { userName, email, password: 'Test1234!' };
}

function generateArticleData(userName) {
  const getText = (label) => `${userName} ${label}`;
  return {
    title: getText('title'),
    description: getText('description'),
    body: getText('body')
  };
}

describe('Article functionality', () => {
  let userData;
  let articleData;

  const selectors = {
    title: '[placeholder="Article Title"]',
    description: '[placeholder="What\'s this article about?"]',
    body: '[placeholder="Write your article (in markdown)"]',
    publishBtn: '[type="button"]',
    deleteBtn: '.btn',
    globalFeedLink: '.nav-link',
    noArticlesMsg: '.article-preview'
  };

  beforeEach(() => {
    userData = generateUser();
    articleData = generateArticleData(userData.userName);

    cy.login(userData.email, userData.userName, userData.password);
  });

  it('creates a new article', () => {
    cy.visit('https://conduit.mate.academy/editor');

    cy.get(selectors.title).type(articleData.title);
    cy.get(selectors.description).type(articleData.description);
    cy.get(selectors.body).type(articleData.body);
    cy.get(selectors.publishBtn).click();

    cy.get('h1').should('contain.text', articleData.title);
    cy.get('div > p').should('contain.text', articleData.body);
  });

  it('deletes the article', () => {
    cy.createArticle(
      articleData.title,
      articleData.description,
      articleData.body
    ).then((response) => {
      const slug = response.body.article.slug;
      cy.visit(`article/${slug}`);
    });

    cy.contains(selectors.deleteBtn, 'Delete Article').click();
    cy.contains(selectors.globalFeedLink, 'Global Feed').should('be.visible');
    cy.get(selectors.noArticlesMsg).should(
      'contain.text',
      'No articles are here... yet.'
    );
  });
});
