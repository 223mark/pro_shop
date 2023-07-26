// dependecies
import { toast } from 'react-toastify'
import { Form, Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, FormCheck, FormControl, FormGroup, FormLabel } from 'react-bootstrap';


// components
import FromContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import Message from '../../components/Message'


// slices
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation
} from '../../slices/userApiSlice';

const UserEditScreen = () => {
    const { id: userId } = useParams();
  const navigate = useNavigate();
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    
   
    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
    
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
            
        }
    }, [user]);


    const submitHandler = async (e) => {
      e.preventDefault();

      try {
        await updateUser({ userId, name, email, isAdmin });
        toast.success('User updated successfully');
        refetch();
        navigate('/admin/userlist');
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }

    
  return (
      <>
          <Link to='/admin/userlist' className='btn btn-light my-3' >
              Go Back
          </Link>
          <FromContainer>
              <h4>Edit User</h4>
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
                              <FormGroup controlId='email' className='my-2'>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl
                                      type='email'
                                      placeholder='Enter email'
                                      value={email}
                                      onChange={(e)=> setEmail(e.target.value)}
                                  />                     
                              </FormGroup>     
                              <FormGroup className='mt-3 mb-2'>
                                <FormCheck type='checkbox'
                                  label='IsAdmin'
                                  checked={isAdmin}
                                  onChange={(e) => setIsAdmin(e.target.checked)}
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

export default UserEditScreen