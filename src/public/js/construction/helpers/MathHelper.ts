interface Point {
  x: number,
  y: number
}
interface Region {
  x: number,
  y: number,
  width: number,
  height: number
}

var MathHelper = {
  createPoint: (dx: number, dy: number, origin: Point={x: 0, y: 0}): Point => {
    return {
      x: origin.x + dx,
      y: origin.y + dy
    }
  },
  createRegion: (a: Point, b: Point): Region => {
    return {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      width: Math.abs(a.x - b.x),
      height: Math.abs(a.y - b.y)
    }
  },
  inRegion: (r: Region, p: Point): boolean => {
    return (p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height);
  },
  isOverlap: (a: Region, b: Region): boolean => {
    return (a.x < b.x + b.width) && (a.x + a.width > b.x) && (a.y < b.y + b.height) && (a.y + a.height > b.y);
  },
  clamp: (value: number, minimum: number, maximum: number): number => {
    return Math.min(Math.max(value, minimum), maximum);
  }
};

export {Point, MathHelper};