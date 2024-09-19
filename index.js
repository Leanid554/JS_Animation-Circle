class Circle {
  constructor(w, h) {
    this.el = document.createElement("div");
    this.width = w;
    this.height = h;
  }

  init() {
    this.el.className = "circle-container";
    this.el.style.width = appendPx(this.width);
    this.el.style.height = appendPx(this.height);
    this.el.style.position = "relative";
    this.el.style.marginLeft = "1080px";
    this.el.style.marginTop = "-460px";
  }

  add(item) {
    this.el.appendChild(item);
  }

  addAll(items) {
    for (let item of items) {
      this.el.appendChild(item);
    }
  }

  append() {
    document.body.appendChild(this.el);
  }
}

class CircleItem {
  constructor(d, text) {
    this.el = document.createElement("div");
    this.diameter = d;
    this.text = text;
    this.isActive = false;
    this.defaultDiameter = 24;
    this.init();
  }

  init() {
    this.el.className = "circle-item";
    this.el.style.width = appendPx(this.diameter);
    this.el.style.height = appendPx(this.diameter);
    this.el.style.borderRadius = "50%";
    this.el.style.position = "absolute";
    this.el.style.transition =
      "transform 0.5s ease, width 0.5s ease, height 0.5s ease, background-color 0.5s ease";
    this.el.style.display = "flex";
    this.el.style.alignItems = "center";
    this.el.style.justifyContent = "center";
    this.el.style.backgroundColor = "black";

    this.textElement = document.createElement("span");
    this.textElement.textContent = this.text;
    this.textElement.style.color = "white";
    this.textElement.style.fontSize = "12px";
    this.textElement.style.fontWeight = "bold";
    this.textElement.style.display = "none";

    this.el.appendChild(this.textElement);

    this.el.addEventListener("mouseenter", () => this.onHover());
    this.el.addEventListener("mouseleave", () => this.onLeave());

    this.el.addEventListener("click", () => this.onClick());
  }

  onHover() {
    if (!this.isActive) {
      this.el.style.backgroundColor = "white";
      this.textElement.style.color = "black";
      this.textElement.style.display = "inline";

      this.setSize(this.defaultDiameter * 1.5);
    }
  }

  onLeave() {
    if (!this.isActive) {
      this.el.style.backgroundColor = "black";
      this.textElement.style.color = "white";
      this.textElement.style.display = "none";

      this.setSize(this.defaultDiameter);
    }
  }

  onClick() {
    if (!this.isActive) {
      const index = parseInt(this.text) - 1;
      if (index >= 0 && index < dates.length) {
        currentIndex = index;
        updateHeader();

        const items = circleList.items;
        if (items.length === 0) return;

        const end = items.length - 1;
        const tempX = items[0].x;
        const tempY = items[0].y;

        for (let i = 0; i < end; i++) {
          items[i].x = items[i + 1].x;
          items[i].y = items[i + 1].y;
        }

        items[end].x = tempX;
        items[end].y = tempY;

        circleList.updateSizes(currentIndex);

        updateYearCards();
      }
    }
  }

  updatePosition() {
    this.el.style.transform = `translate(${appendPx(this._x)}, ${appendPx(
      this._y
    )})`;
  }

  set x(v) {
    this._x = v;
    this.updatePosition();
  }

  set y(v) {
    this._y = v;
    this.updatePosition();
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  setSize(diameter) {
    this.diameter = diameter;
    this.el.style.width = appendPx(this.diameter);
    this.el.style.height = appendPx(this.diameter);
    this.updatePosition();
  }

  setVisible(visible) {
    this.textElement.style.display = visible ? "inline" : "none";
  }

  setActive(active) {
    this.isActive = active;
    this.el.style.backgroundColor = active ? "white" : "black";
    this.textElement.style.color = active ? "black" : "white";
    this.textElement.style.display = active ? "inline" : "none";
    if (active) {
      this.setSize(this.defaultDiameter * 1.5);
    } else {
      this.setSize(this.defaultDiameter);
    }
  }
}

class CircleList {
  constructor(parentSize, angle, count) {
    this.parentSize = parentSize;
    this.radius = this.parentSize / 2;
    this.count = count;
    this.angle = angle;
    this.positions = [];
  }

  init() {
    const angles = [50, 130, 180, 230, 310, 360];
    for (let angle of angles) {
      const obj = {};
      obj.x = Math.floor(this.radius * Math.cos(degreesToRadians(angle)));
      obj.y = Math.floor(this.radius * Math.sin(degreesToRadians(angle)));
      this.positions.push(obj);
    }
  }

  calcRelativeDistance(Shape) {
    this.items = this.positions.map((item, index) => {
      const circleItem = new Shape(this.parentSize / 6, index + 1);
      circleItem.x = item.x + this.radius - circleItem.diameter / 2;
      circleItem.y = item.y + this.radius - circleItem.diameter / 2;
      return circleItem;
    });
  }

  set elements(v) {
    this._elements = v;
  }

  get elements() {
    return this.items.map((item) => item.el);
  }

  updateSizes(activeIndex) {
    this.items.forEach((item, index) => {
      const size = index === activeIndex ? this.parentSize / 14 : 24;
      item.setSize(size);
      item.setVisible(index === activeIndex || !item.isActive);
      item.setActive(index === activeIndex);
    });
  }
}

function next() {
  currentIndex = (currentIndex - 1 + dates.length) % dates.length;
  updateHeader();

  const items = circleList.items;
  if (items.length === 0) return;

  const end = items.length - 1;
  const tempX = items[0].x;
  const tempY = items[0].y;

  for (let i = 0; i < end; i++) {
    items[i].x = items[i + 1].x;
    items[i].y = items[i + 1].y;
  }

  items[end].x = tempX;
  items[end].y = tempY;

  circleList.updateSizes(currentIndex);

  updateYearCards();
}

function prev() {
  currentIndex = (currentIndex + 1) % dates.length;
  updateHeader();

  const items = circleList.items;
  if (items.length === 0) return;

  const end = items.length - 1;
  const tempX = items[end].x;
  const tempY = items[end].y;

  for (let i = end; i > 0; i--) {
    items[i].x = items[i - 1].x;
    items[i].y = items[i - 1].y;
  }

  items[0].x = tempX;
  items[0].y = tempY;

  circleList.updateSizes(currentIndex);

  updateYearCards();
}

function appendPx(n) {
  return n + "px";
}

function degreesToRadians(degrees) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

const dates = ["01/06", "02/06", "03/06", "04/06", "05/06", "06/06"];
let currentIndex = 0;
const years = [
  { start: "1992", end: "1997" },
  { start: "1997", end: "2003" },
  { start: "2003", end: "2008" },
  { start: "2008", end: "2013" },
  { start: "2013", end: "2018" },
];

function updateHeader() {
  const header = document.querySelector("h2");
  const date = dates[currentIndex];
  header.textContent = `${date}`;
  const yearStart = document.querySelector("h3.blue");
  const yearEnd = document.querySelector("h3.pink");

  yearStart.textContent = years[currentIndex].start;
  yearEnd.textContent = years[currentIndex].end;
}

function updateYearCards() {
  const cards = document.querySelectorAll(".year-card");
  const totalCards = cards.length;
  const visibleCardsCount = 3;

  let startIndex = Math.max(
    currentIndex - Math.floor(visibleCardsCount / 2),
    0
  );
  let endIndex = Math.min(startIndex + visibleCardsCount - 1, totalCards - 1);

  if (endIndex - startIndex + 1 < visibleCardsCount) {
    startIndex = Math.max(endIndex - visibleCardsCount + 1, 0);
  }

  cards.forEach((card, i) => {
    card.classList.toggle("hidden", i < startIndex || i > endIndex);
  });
}

const width = 530;
const height = 530;
const angle = 90;
const viewCount = 4;
const circle = new Circle(width, height);
const circleList = new CircleList(width, angle, viewCount);
circle.init();
circle.append();
circleList.init();
circleList.calcRelativeDistance(CircleItem);
circle.addAll(circleList.elements);

updateHeader();
circleList.updateSizes(currentIndex);
updateYearCards();
