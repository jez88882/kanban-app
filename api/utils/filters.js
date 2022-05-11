class APIFilters {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    this.query = this.query.find(this.queryStr);
    console.log(this.query)
    console.log(this.queryStr)
    return this
  }
}
module.exports = APIFilters