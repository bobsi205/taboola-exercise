function createWidget(result) {
  var taboolaWidget = document.getElementsByClassName('taboola-widget')[0];
  taboolaWidget.innerHTML = '';
  //import style
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = './taboola-widget/style.css';
  taboolaWidget.appendChild(style);

  //create widget frame
  var widgetHeader = {
    elementType: 'div',
    class: 'taboola-widget-header',
    child: [
      {
        elementType: 'span',
        innerHTML: 'You May Like',
        class: 'taboola-header-title',
        child: [],
      },
      {
        elementType: 'span',
        innerHTML: 'Sponsored Links By Taboola',
        class: 'taboola-header-sponsor',
        child: [],
      },
    ],
  };
  taboolaWidget.appendChild(GenerateHtmlRecursively(widgetHeader));

  var widgetCardComponent = {
    elementType: 'div',
    class: 'taboola-card-container',
    child: [],
  };
  var parentCardContainer = GenerateHtmlRecursively(widgetCardComponent);

  taboolaWidget.appendChild(parentCardContainer);

  //create card components
  result = JSON.parse(result);
  for (var i = 0; i < result.list.length; i++) {
    var card = result.list[i];
    var cardObject = {
      elementType: 'div',
      class: 'taboola-card',
      child: [
        {
          elementType: 'a',
          href: card.url,
          child: [
            {
              elementType: 'img',
              class: 'taboola-card-image',
              src: card.thumbnail[0].url,
              width: card.thumbnail[0].width,
              height: card.thumbnail[0].height,
              child: [],
            },
          ],
        },
        {
          elementType: 'a',
          href: card.url,
          class: 'taboola-card-title',
          innerHTML: card.name,
          dir: 'auto',
          child: [],
        },
        {
          elementType: 'div',
          class: 'taboola-card-footer',
          child: [
            {
              elementType: 'a',
              href: card.url,
              class: 'taboola-card-branding',
              innerHTML: card.branding,
              child: [],
            },
            {
              elementType: 'p',
              class: 'taboola-card-category',
              innerHTML: card.categories ? card.categories[0] : '',
              child: [],
            },
          ],
        },
      ],
    };

    parentCardContainer.appendChild(GenerateHtmlRecursively(cardObject));
  }
  EllipsisTitles(taboolaWidget, result.list);
  window.addEventListener('resize', function () {
    EllipsisTitles(taboolaWidget, result.list);
  });
}

function GenerateHtmlRecursively(cardObject) {
  var element = document.createElement(cardObject.elementType);
  if (cardObject.class != undefined) element.className = cardObject.class;
  if (cardObject.innerHTML != undefined)
    element.innerHTML = cardObject.innerHTML;

  switch (cardObject.elementType) {
    case 'a':
      element.href = cardObject.href;
      if (
        navigator.userAgent.indexOf('MSIE') == '-1' &&
        cardObject.dir != undefined
      )
        element.dir = cardObject.dir;
      break;
    case 'img':
      element.src = cardObject.src;
      element.width = cardObject.width;
      element.height = cardObject.height;
      break;
    case 'span':
      if (cardObject.style != undefined) element.style = cardObject.style;
    default:
      break;
  }

  for (var i = 0; i < cardObject.child.length; i++) {
    element.appendChild(GenerateHtmlRecursively(cardObject.child[i]));
  }
  return element;
}

function EllipsisTitles(taboolaWidget, cardsList) {
  var titles = document.getElementsByClassName('taboola-card-title');
  if (window.innerWidth > 800) {
    var maxLength = (taboolaWidget.offsetWidth - 20 * 3) / 8;
  } else {
    var maxLength = ((taboolaWidget.offsetWidth - 20) / 8) * 3;
  }

  for (var i = 0; i < cardsList.length; i++) {
    var card = cardsList[i];
    if (card.name.length > maxLength) {
      var trimmedString = card.name.substring(0, maxLength);
      trimmedString = trimmedString.substring(
        0,
        trimmedString.lastIndexOf(' ')
      );
      titles[i].innerHTML = trimmedString + '...';
    } else {
      titles[i].innerHTML = card.name;
    }
  }
}

function getWidgetData(callback) {
  var url =
    'https://api.taboola.com/1.2/json/apitestaccount/recommendations.get?app.type=web&app.apikey=7be65fc78e52c11727793f68b06d782cff9ede3c&source.id=%2Fdigiday-publishing-summit%2F&source.url=https%3A%2F%2Fblog.taboola.com%2Fdigiday-publishing-summit%2F&source.type=text&placement.organic-type=mix&placement.visible=true&placement.available=true&placement.rec-count=6&placement.name=Below%20Article%20Thumbnails&placement.thumbnail.width=640&placement.thumbnail.height=480&user.session=init';

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.response);
    }
  };

  xhr.open('GET', url, true);
  xhr.send('');
}

getWidgetData(createWidget);
