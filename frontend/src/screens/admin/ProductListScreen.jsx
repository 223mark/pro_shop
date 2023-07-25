import { Button, Col, Row, Table } from 'react-bootstrap';
import {useGetProductsQuery} from '../../slices/productApiSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
const ProductListScreen = () => {
    const { data: products, isLoading, error } = useGetProductsQuery();

    const deleteHandler = (productId) => {
        
    }
    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h2>Products</h2>
                </Col>
                <Col className='text-end'>
                    <Button className='btn-sm m-3'>
                        <FaEdit/> Creat Product
                    </Button>
                </Col>
            </Row>
            {isLoading ? <Loader /> : error
                ? <Message variant='danger'>
                    {error?.data?.message || error.message}
                </Message>
                : (
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
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className='btn-sm mx-2'>
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
                )}
        </>
  )
}

export default ProductListScreen