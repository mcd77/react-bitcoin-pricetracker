class GetBitcoinData extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bitcoinData : [],
            error : null,
            isLoaded : false,
            intervalId : -1
        };
    }

    fetchData(component) {
        fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then( response => response.json())
        .then(
            (result) => {
                component.setState({
                    isLoaded : true,
                    bitcoinData : result
                });
            },
            (error) => {
                component.setState({
                    isLoaded: true,
                    error: error
                })
            },
        )
        .catch(error => console.log(error));
    }


    componentDidMount() {
        setTimeout(this.fetchData, 1, this);
        let id = setInterval(this.fetchData, 60000, this);
        this.state.intervalId = id;
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
        const {error, isLoaded, bitcoinData} = this.state;
        if(error) {
            return <div>Error in loading</div>
        } else if (!isLoaded) {
            return <div>Loading ...</div>
        } else {
            return(
                <div>
                  {populateBitcoinData(bitcoinData)}
                </div>
            );
        }
    }
}

function populateBitcoinData(data) {
    try {
        let outArray = [];
        outArray.push(<p className="description-text" key={"time"}>{"Last update time: " + data["time"]["updated"]}</p>);
        outArray.push(<p className="description-text" key={"usd"}>{"USD: $" + data["bpi"]["USD"]["rate"]}</p>);
        outArray.push(<p className="description-text" key={"gbp"}>{"GBP: £" + data["bpi"]["GBP"]["rate"]}</p>);
        outArray.push(<p className="description-text" key={"eur"}>{"EUR: €" + data["bpi"]["EUR"]["rate"]}</p>);
        outArray.push(<p className="description-text" key={"disclaimer"}>{"Disclaimer: " + data["disclaimer"]}</p>);
        return outArray;
    } catch(err) {
        console.log(err);
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="App">
            <h1 className="title-text">Bitcoin Price Tracker</h1>
            <img width="200" height="200" src="/images/bitcoin.webp"/>
            <GetBitcoinData/>
            </div>
        );
    }
}

const app =
<div>
    <App />
</div>

ReactDOM.render(app, document.getElementById("root"));
