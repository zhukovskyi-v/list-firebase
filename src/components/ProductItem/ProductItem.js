import React, {useEffect, useState} from 'react'
import {useRouteMatch} from 'react-router';
import {Button, Card, Col, Form, ListGroup, Spinner} from 'react-bootstrap';
import {db} from '../../firebase';
import firebase from "firebase";
import './product-item.css'
import {ModalForm} from "../ModalForm/ModalForm";

export const ProductItem = () => {
    const match = useRouteMatch();
    const [data, setData] = useState()
    const [comment, setComment] = useState({})
    const [validated, setValidated] = useState(false);
    const [itemFirebaseID, setItemFirebaseID] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true)
        if (comment.length > 3 && itemFirebaseID) {
            db.collection("product").doc(itemFirebaseID)
                .update({
                    comments: firebase.firestore.FieldValue.arrayUnion({
                        id: Date.now(),
                        productId: itemID,
                        description: comment,
                        date: new Date(Date.now()).toString().slice(0, 24)
                    })
                });
        }
    };
    const itemID = match.url.slice(1, match.url.length)
    useEffect(() => {

        const getData = async () => {
            await db.collection("product").where("id", "==", itemID)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        setItemFirebaseID(doc.id)
                        setData(doc.data())
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            await setComment('')
            await setValidated(false)
        }
        getData();
    }, [match, itemID])


    if (data) {
        return (
            <>
                <Card className='product-item-cart'>
                    <div className="d-flex">
                        <Card.Img variant="top" className='product-item-cart-image' src={data.imageUrl}/>
                        <Card.Body>
                            <Card.Title>
                                {data.name}
                            </Card.Title>
                            <Card.Text>
                                {data.description}
                            </Card.Text>
                            <ListGroup className='product-item-cart-list'>
                                <ListGroup.Item>Count: {data.count}</ListGroup.Item>
                                <ListGroup.Item>Size:
                                    <ListGroup.Item>Height: {data.size.height}</ListGroup.Item>
                                    <ListGroup.Item>Width: {data.size.width}</ListGroup.Item>
                                </ListGroup.Item>

                                <ListGroup.Item>Weight: {data.weight}</ListGroup.Item>
                            </ListGroup>
                            <ModalForm data={data} firebaseID={itemFirebaseID}/>
                        </Card.Body>
                    </div>
                    <Card.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Row className='justify-content-center'>
                                <Form.Group as={Col} md={6} controlId="validationCustom01">
                                    <Form.Label>Write your comment here</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="First name"
                                        value={comment}
                                        onChange={({target}) => {
                                            setComment(target.value)
                                        }}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Button className='send-comment-btn' type="submit">Submit form</Button>
                            </Form.Row>
                        </Form>
                        <Card.Title>
                            Comments
                        </Card.Title>
                        {data.comments.length > 0 ? <ListGroup.Item> {data.comments.map(item => {
                            return <ListGroup.Item key={item.id}>
                                <p>
                                    {item.date}:
                                </p>
                                <p className='d-inline-block'>
                                    {item.description}
                                </p>{' '}
                                <Button variant="secondary" onClick={
                                    async () => {
                                        await db.collection("product").doc(itemFirebaseID)
                                            .update({
                                                comments: firebase.firestore.FieldValue.arrayRemove(item)
                                            })
                                    }
                                }>
                                    Delete
                                </Button>
                            </ListGroup.Item>;
                        })}

                        </ListGroup.Item> : <p>Haven`t some comment. You can be first</p>}
                    </Card.Body>
                </Card>
            </>
        );
    }
    return <Spinner animation="grow"/>

}

