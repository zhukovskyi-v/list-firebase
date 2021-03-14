import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import {Header} from '../Header/Header'
import {db} from '../../firebase'
import {ProductList} from '../ProductList/ProductList'
import {ProductItem} from '../ProductItem/ProductItem'
import {Button, ButtonGroup, Spinner} from 'react-bootstrap'

function App() {
    const [data, setData] = useState([])

    useEffect(() => {
        db.collection('product')
            .orderBy('name', 'asc')
            .onSnapshot((snapshot) => {
                setData(snapshot.docs.map((doc) => doc.data()))
            }, (error => console.log(error)))
    }, [])

    const sortByName = async () => {
        await db
            .collection('product')
            .orderBy('name', 'asc')
            .onSnapshot((snapshot) => {
                setData(snapshot.docs.map((doc) => doc.data())
                )
            }, (error) => {
                console.log("Error getting cached document:", error);
            })
    }
    const sortByCount = async () => {
        await db
            .collection('product')
            .orderBy('count', 'desc')
            .onSnapshot((snapshot) => {
                setData(snapshot.docs.map((doc) => doc.data()))
            }, (error => console.log(error)))
    }

    return (
        <Router>
            <div className="App">
                <Header/>
                <Switch>
                    <Route path="/:topicId">
                        <ProductItem/>
                    </Route>
                    <Route path="/" exact>
                        {data.length > 0 ? (
                            <>
                                <ButtonGroup>
                                    <ButtonGroup aria-label="Basic example">
                                        <Button variant="secondary" onClick={sortByName}>
                                            Sort by names
                                        </Button>
                                        <Button variant="secondary" onClick={sortByCount}>
                                            Sort by counts
                                        </Button>
                                    </ButtonGroup>
                                </ButtonGroup>
                                <ProductList data={data}/>
                            </>
                        ) : (
                            <Spinner animation="grow"/>
                        )}
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
