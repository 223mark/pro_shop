// dependecies
import { toast } from 'react-toastify'
import { Form, Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';


// components
import FromContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message'


// slices
import {
    useGetProductDetailsQuery,
    useUpdateProductMutation,
    useUploadProductImageMutation
} from '../../slices/productApiSlice';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
   
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
    
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
    
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);


    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
             productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }
        
        const res = await updateProduct(updatedProduct);
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success('Producted Updated..');
            navigate('/admin/productlist');
        }
    }

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        console.log(formData);

        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message)
            setImage(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }
  return (
      <>
          <Link to='/admin/productlist' className='btn btn-light my-3' >
              Go Back
          </Link>
          <FromContainer>
              <h4>Edit Product</h4>
              {loadingUpdate && <Loader />}
              
              {isLoading ? <Loader />
                  : error ?
                      <Message variant='danger'>
                          {error?.data?.message || error.message}
                      </Message> 
                      : (
                          <Form className='mt-3' onSubmit={(e)=> submitHandler(e)}>
                              <FormGroup controlId='name' className='my-2'>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl
                                      type='text'
                                      placeholder='Enter name'
                                      value={name}
                                      onChange={(e)=> setName(e.target.value)}
                                  />                     
                              </FormGroup>
                              <FormGroup controlId='price' className='my-2'>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl
                                      type='number'
                                      placeholder='Enter price'
                                      value={price}
                                      onChange={(e)=> setPrice(e.target.value)}
                                  />                     
                              </FormGroup>
                              <FormGroup>
                                   <FormLabel>Image</FormLabel>
                                  <FormControl
                                      type="text"
                                      placeholder='Enter Image url'
                                      value={image}
                                      onChange={(e)=> setImage(e.target.value)}
                                  />
                    
                                  <FormControl
                                      type="file"
                                      label="Choose File"
                                      onChange={(e) => uploadFileHandler(e)}
                                  />      
                              </FormGroup>
                              
                              <FormGroup controlId='brand' className='my-2'>
                                  <FormLabel>Brand</FormLabel>
                                  <FormControl
                                      type='text'
                                      placeholder='Enter brand'
                                      value={brand}
                                      onChange={(e)=> setBrand(e.target.value)}
                                  />                     
                              </FormGroup>
                              <FormGroup controlId='countInstock' className='my-2'>
                                  <FormLabel>Count Instock</FormLabel>
                                  <FormControl
                                      type='number'
                                      placeholder='Enter Count of Instock'
                                      value={countInStock}
                                      onChange={(e)=> setCountInStock(e.target.value)}
                                  />                     
                              </FormGroup>
                              
                              <FormGroup controlId='category' className='my-2'>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl
                                      type='text'
                                      placeholder='Enter category'
                                      value={category}
                                      onChange={(e)=> setCategory(e.target.value)}
                                  />                     
                              </FormGroup>
                              <FormGroup controlId='description' className='my-2'>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl
                                      type='text'
                                      placeholder='Enter description'
                                      value={description}
                                      onChange={(e)=> setDescription(e.target.value)}
                                  />                     
                              </FormGroup>

                              <Button type='submit' variant='primary' className='my-2'>
                                  Update
                              </Button>
                          </Form>
                      )}
          </FromContainer>
      </>
  )
}

export default ProductEditScreen