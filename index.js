const fs = require('fs');
const http = require('http');
const url = require('url');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObject = JSON.parse(data);

const tempOverview = fs.readFileSync(
  './templates/templateOverview.html',
  'utf8'
);

const tempProduct = fs.readFileSync(
  './templates/templateProduct.html',
  'utf-8'
);

const tempCard = fs.readFileSync('./templates/templateCard.html', 'utf-8');

const makeTemplate = (template, el) => {
  let output = template.replace(/{%PRODUCTIMAGE%}/g, el.image);
  output = output.replace(/{%PRODUCTNAME%}/g, el.productName);
  output = output.replace(/{%PRODUCTQUANTITY%}/g, el.quantity);
  output = output.replace(/{%PRODUCTPRICE%}/g, el.price);
  output = output.replace(/{%PRODUCTID%}/g, el.id);
  output = output.replace(/{%PRODUCTFROM%}/g, el.from);
  output = output.replace(/{%NUTRIENTS%}/g, el.nutrients);
  output = output.replace(/{%PRODUCTDESCRIPTION%}/g, el.description);

  if (!el.organic) {
    output = output.replace(/{%ISORGANIC%}/g, '.not-organic');
  }

  return output;
};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    const cardsArray = dataObject.map((el) => makeTemplate(tempCard, el));
    const cards = cardsArray.join('');
    const output = tempOverview.replace(/{%PRODUCTCARD%}/g, cards);
    res.end(output);
  } else if (pathname === '/product') {
    const id = query.id * 1;
    const element = dataObject.find((el) => el.id === id);
    const output = makeTemplate(tempProduct, element);
    res.end(output);
  } else {
    res.end('Page not found');
  }
});

server.listen(8000, '127.0.0.1', (err, res) => {
  console.log('Listening on the port 8000');
});
