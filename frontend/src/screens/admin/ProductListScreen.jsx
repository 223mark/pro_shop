// dependecies
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom';

// slices
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from '../../slices/productApiSlice';
// components
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Paginate from '../../components/Paginate';

const ProductListScreen = () => {
    const pageNumber = useParams();
    const { data, isLoading, error, refetch } = useGetProductsQuery(pageNumber);

    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();

    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
    

    const deleteHandler = async (productId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteProduct(productId);
                refetch();
                toast.success('Product Deleted');
            } catch (error) {
                toast.error(error?.data?.message ||error.error)
            }
        }
    }

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to creat product')) {
            try {
                await createProduct();
                refetch();
                toast.success("Product created.")
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h2>Products</h2>
                </Col>
                <Col className='text-end'>
                    <Button
                        onClick={createProductHandler}
                        className='btn-sm m-3'>
                        <FaEdit/> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
            {loadingDelete && <Loader/>}
            {isLoading ? <Loader /> : error
                ? <Message variant='danger'>
                    {error?.data?.message || error.message}
                </Message>
                : (
                    <>
                        <Table striped hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button
                                                variant='light'
                                                className='btn-sm mx-2'>
                                                <FaEdit/>
                                            </Button>
                                        </LinkContainer>
                                        <Button 
                                            onClick={()=> deleteHandler(product._id)}
                                        variant='danger' className='btn-sm'>
                                            <FaTrash/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="float-end">
                            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                </div>
                    </>
                )}
        </>
  )
}

export default ProductListScreen