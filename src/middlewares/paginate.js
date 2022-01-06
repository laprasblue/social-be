function paginate(service) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < (await service.countDocs())) {
      results.next = {
        page: page + 1,
        limit: limit,
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      }
    }
    try {
      results.results = await service.findAll(limit, startIndex)
      res.paginatedResults = results
      next()
    } catch (e) {
      console.log(e.message)
      res.status(500)
    }
  }
}
module.exports = paginate
