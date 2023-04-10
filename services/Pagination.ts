// import app from "../api/v1/route/MemberSystem";

const isEmpty = require("lodash/isEmpty");

export class Pagination {
    static async paginate(entity,page = <any> 1,perPage = <any> 15){
        perPage = !isEmpty(perPage) ? parseInt(perPage) : 15;
        page = !isEmpty(page) ? parseInt(page) : 1;
        let total = await entity.getCount();

        let lastPage = Math.ceil(total/perPage);
        let from = ((page*perPage)-perPage);

        entity = await entity.skip(from)
            .take(perPage)
            .getMany();

        return {
            total,
            perPage,
            currentPage: page,
            lastPage,
            from,
            to: perPage,
            data: entity,
        };
    }
}
// export default app