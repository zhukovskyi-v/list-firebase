import React, {useEffect, useState} from 'react'
import {Button, Form, InputGroup, Modal} from 'react-bootstrap'
import Col from 'react-bootstrap/Col'
import {db} from '../../firebase'
import './modal-form.css'

export function ModalForm({data, firebaseID}) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [validated, setValidated] = useState(false)
    const [itemData, setItemData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        count: '',
        color: '',
        weight: '',
        size: {
            height: '',
            width: '',

        },

    })
    const sendProductItem = async () => {
        const itemID = await Date.now().toString()
        if (validated) {
            const {
                name,
                description,
                count,
                color,
                weight,
                size: {
                    height,
                    width,
                },
                imageUrl,
            } = itemData;
            await db.collection('product').add({
                id: itemID,
                name,
                imageUrl,
                description,
                count: +count,
                color: color,
                size: {
                    width: +width,
                    height: +height,
                },
                weight: weight.toString(),
                comments: [{
                    id: Date.now(),
                    productId: itemID,
                    description: `First comment for [${name}]`,
                    date: new Date(Date.now()).toString().slice(0, 24)
                },],
            })
            await resetItemData()
        }
    }
    const updateProductItem = async () => {
        await db.collection("product").doc(firebaseID)
            .update({
                count: itemData.count,
                description: itemData.description,
                imageUrl: itemData.imageUrl,
                name: itemData.name,
                color: itemData.color,
                size: {
                    width: itemData.size.width,
                    height: itemData.size.height
                },
                weight: itemData.weight
            })
        await handleClose()
    }
    const resetItemData = () => {
        setShow(false)
        setItemData({
            name: '',
            description: '',
            count: '',
            color: '',
            size: {
                width: '',
                height: '',
            },
            weight: '',
            imageUrl: ''
        })
        setValidated(false)
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.stopPropagation()
        }
        setValidated(true)
        if (itemData.color &&
            itemData.size.height
            && itemData.weight &&
            itemData.name &&
            itemData.imageUrl &&
            itemData.description
            && itemData.size.width &&
            itemData.count) {
            if (firebaseID) {
                updateProductItem()
            } else {
                if (validated) {
                    sendProductItem()
                }
            }
        }
    }

    useEffect(() => {
        if (data) {
            setItemData(data)
        }
    }, [])
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                {firebaseID ? 'Edit' : 'New Product'}
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{firebaseID ? itemData.name : 'Add item to product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Product name"
                                    value={itemData.name}
                                    onChange={({target}) => {
                                        setItemData({
                                            ...itemData,
                                            name: target.value,
                                        })
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a name.
                                </Form.Control.Feedback>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="12" controlId="validationCustom02">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Description"
                                    value={itemData.description}
                                    onChange={({target}) => {
                                        setItemData({
                                            ...itemData,
                                            description: target.value,
                                        })
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a Description.
                                </Form.Control.Feedback>
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
                                <Form.Label>Quantity</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="number"
                                        placeholder="5"
                                        value={itemData.count}
                                        aria-describedby="inputGroupPrepend"
                                        required
                                        onChange={({target}) => {
                                            setItemData({
                                                ...itemData,
                                                count: +target.value,
                                            })
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a Quantity.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustomColorName">
                                <Form.Label>Color</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        placeholder="red"
                                        value={itemData.color}
                                        aria-describedby="inputGroupPrepend"
                                        required
                                        onChange={({target}) => {
                                            setItemData({
                                                ...itemData,
                                                color: target.value,
                                            })
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a color.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="4" controlId="validationCustom03">
                                <Form.Label>Width</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Width"
                                    value={itemData.size.width}
                                    onChange={({target}) => {
                                        setItemData({
                                            ...itemData,
                                            size: {
                                                ...itemData.size,
                                                width: +target.value
                                            }
                                        })
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid width.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom04">
                                <Form.Label>Height</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Height"
                                    required
                                    value={itemData.size.height}
                                    onChange={({target}) => {
                                        setItemData({
                                            ...itemData,
                                            size: {...itemData.size, height: +target.value}
                                        })
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid height.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationCustom05">
                                <Form.Label>Weight</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="200g"
                                    value={itemData.weight}
                                    onChange={({target}) => {
                                        setItemData({
                                            ...itemData,
                                            weight: target.value,
                                        })
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid weight.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom06">
                                <Form.Label>Image url</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="write here image url"
                                    value={itemData.imageUrl}
                                    onChange={({target}) => {
                                        setItemData({
                                            ...itemData,
                                            imageUrl: target.value,
                                        })
                                    }}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid image url.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>{' '}
                        <Button type="submit">Submit form</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
