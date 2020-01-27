import React, { Component } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Pagination from "./components/Pagination/Pagination";
import { Container, Col, Row, Modal, Button, Badge } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      currentPage: 1,
      totalResults: 0,
      shoppingCart: []
    };
  }

  /* specifying each item to open each modal */
  closeModal = () => {
    this.setState({
      openedDialog: null
    });
  };

  displayContent = id => {
    this.setState({
      openedDialog: id
    });
  };

  /* NAV REST API */

  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    fetch(`https://arbeidsplassen.nav.no/public-feed/api/v1/ads?size=10`, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMudG9rZW4udjFAbmF2Lm5vIiwiYXVkIjoiZmVlZC1hcGktdjEiLCJpc3MiOiJuYXYubm8iLCJpYXQiOjE1NTc0NzM0MjJ9.jNGlLUF9HxoHo5JrQNMkweLj_91bgk97ZebLdfx3_UQ"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        console.log(myJson);
        this.setState({
          content: myJson.content
        });
      });
  }

  /* pagination */
  nextPage = pageNumber => {
    fetch(
      `https://arbeidsplassen.nav.no/public-feed/api/v1/ads?size=10&page=${pageNumber}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwdWJsaWMudG9rZW4udjFAbmF2Lm5vIiwiYXVkIjoiZmVlZC1hcGktdjEiLCJpc3MiOiJuYXYubm8iLCJpYXQiOjE1NTc0NzM0MjJ9.jNGlLUF9HxoHo5JrQNMkweLj_91bgk97ZebLdfx3_UQ"
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        //console.log(myJson);
        this.setState({
          content: myJson.content,
          currentPage: pageNumber
        });
        console.log(pageNumber);
      });
  };

  /* Saved Items */
  /* saved items modal */
  open = () => {
    this.setState({ showModal: true });
  };

  close = () => {
    this.setState({ showModal: false });
  };

  /* job save button onclick event */
  handleAileClick = event => {
    const { content = [], shoppingCart = [] } = this.state;

    let newList = content.filter(item => {
      return item !== event.target.value;
    });

    this.setState({
      items: [...newList],
      shoppingCart: [...shoppingCart, event.target.value]
    });

    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    localStorage.getItem("shoppingCart");
  };

  /* hydrate the state with local storage */
  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          //JSON.parse converts a JSON string into a JavaScript value
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  /* button delete in saved jobs works with first load */
  handleCartClick = event => {
    event.persist();
    console.log(event.target.value);
    this.setState(prevState => {
      return {
        items: [...prevState.items, event.target.value],
        shoppingCart: prevState.shoppingCart.filter(item => {
          return item !== event.target.value;
        })
      };
    });
  };

  /* saved items end */

  render() {
    var { shoppingCart = [] } = this.state;

    /* pagination */
    const numberPages = Math.floor(this.state.totalResults / 20);

    /* main mapped information*/
    let aisleList = this.state.content.map((item, index) => {
      /* fixed formating of the publishing date*/
      const cleanedDate = new Date(item.published).toLocaleDateString();

      const { jobtitle, title } = item;

      return (
        <div className="cards" key={item.uuid}>
          <Card key={item.uuid}>
            <Container>
              <Row>
                <Col md={3}>
                  <h5>
                    <strong>{item.employer.name}</strong>
                  </h5>
                </Col>
                <Col className="cardRight" md={7}>
                  <p>{cleanedDate}</p>
                  <h6>
                    <strong>{jobtitle}</strong>
                  </h6>
                  <h6>{title}</h6>
                </Col>
                <Col md={2}>
                  <div className="buttons">
                    {/* save button  */}
                    <button
                      className="btn btn-outline-info"
                      id={index}
                      value={item.title}
                      onClick={this.handleAileClick}
                    >
                      Lagre
                    </button>
                    {/* open button and modal */}
                    <button
                      className="btn btn-outline-info"
                      onClick={() => this.displayContent(item.uuid)}
                    >
                      Åpne
                      <div onClick={e => e.stopPropagation()}>
                        <Modal
                          show={this.state.openedDialog === item.uuid}
                          onHide={this.closeModal}
                        >
                          <Modal.Header closeButton={true}>
                            <Modal.Title>{jobtitle}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <h4>{item.employer.name}</h4>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.description
                              }}
                            />
                            <h5>{item.extent}</h5>
                            <h5>Søknadsfrist: {item.applicationDue}</h5>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.closeModal}>Close</Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </button>
                    {/* end open button and modal */}
                  </div>
                </Col>
              </Row>
            </Container>
          </Card>
        </div>
      );
    });

    /* list of saved jobs to saved jobs*/
    let cartList = shoppingCart.map((item, index) => {
      return (
        <div className="savedJobs" key={item.uuid}>
          <span>{item}</span>
        </div>
      );
    });

    return (
      <div className="App">
        <div className="savedModal">
          {/* saved jobs modal */}
          <Button className="btn btn-info" onClick={this.open}>
            Lagrede Jobber <Badge variant="light">{shoppingCart.length}</Badge>
          </Button>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>
                lagrede jobber{" "}
                <Badge variant="dark">{shoppingCart.length}</Badge>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>{cartList}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* job list */}
        <h2 className="heading2">Ledige Stillinger</h2>
        {aisleList}

        <Pagination
          pages={numberPages}
          nextPage={this.nextPage}
          currentPage={this.state.currentPage}
        />
      </div>
    );
  }
}

export default App;
