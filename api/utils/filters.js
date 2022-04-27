class APIFilters {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    // this.query = this.query.find(this.queryStr);
    // return this
    console.log(this.query)
    console.log(this.queryStr)
  }
}
module.exports = APIFilters