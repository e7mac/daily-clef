export default class ModelGetter {
	constructor(api, path, searchParams = {}) {
		this.path = path
		this.itemsPromise = null
		this.hasMore = true
		this.items = []
		this.api = api
		this.searchParams = searchParams
	}

	loadItems() {
		if (this.path !== null) {
			if (this.itemsPromise === null) {
				this.makeApiCall()
			}
		}
		return this.itemsPromise
	}

	loadMoreItems() {
		if (this.path !== null && this.hasMore) {
			this.makeApiCall()
		}
		return this.itemsPromise
	}

	makeApiCall() {
		this.itemsPromise = this.api.apiCall(this.path, {
			method: 'GET'
		}, this.searchParams)
			.then((response) => {
				this.items = this.items.concat(response.results);

				this.hasMore = (response.next !== null)
				this.path = null
				if (response.next) {
					const url = new URL(response.next)
					this.path = `${url.pathname}${url.search}`
				}
				return this.items
			})
			.catch(error => console.log("error: " + error));
	}
}
