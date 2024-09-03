export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exclude = ["page", "sort", "limit", "fields"];
    console.log(queryObj);

    exclude.forEach((el) => delete queryObj[el]);

    const filter = JSON.stringify(queryObj).replace(
      /\b(lte|lt|gte|gt)\b/g,
      (el) => `$${el}`
    );

    this.query = this.query.find(JSON.parse(filter));

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
