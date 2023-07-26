import { Pagination } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
const Paginate = ({pages, page, isAdmin = false, keyword=''}) => {
    return (
         pages > 1 && (
            <Pagination>
                {/* 
                ## this make pages number like array exp-> [1, 2,3,4] 
                ## we add x with 1 bz array's index start with 0
                */}
                {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                        key={x + 1}
                        to={
                            !isAdmin 
                                ? keyword
                                ? `/search/${keyword}/page/${x+1}`
                                : `/page/${x + 1}`
                                :`/admin/productlist/${x+1}`
                        }
                    >
                        {/* active will true if page same with x+1 */}
                        <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                        
                    </LinkContainer>
              ))}
            </Pagination>
      )
  )
}

export default Paginate