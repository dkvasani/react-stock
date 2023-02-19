import React, { Component } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class LineChart extends React.Component {
	lotSize = 50;
	state = {
		finalJson: [],
		finalJson2: [],
		numberOfOptions: 10,
		number: [0],
		breakEven: "",
		strtegyName: "",
		lowerBreakevent: 0,
		higherBreakevent: 0,
		callsidePremium: 0,
		putsidePremium: 0,
		tableData: []
	};
	counter = 0;
	tableDataLocal = [];

	options = [
		14000, 14100, 14200, 14300, 14400, 14500, 14600, 14700, 14800, 14900,
		15000, 15100, 15200, 15300, 15400, 15500, 15600, 15700, 15800, 15900,
		16000, 16100, 16200, 16300, 16400, 16500, 16600, 16700, 16800, 16900,
		17000, 17100, 17200, 17300, 17400, 17500, 17600, 17700, 17800, 17900,
		18000, 18100, 18200, 18300, 18400, 18500, 18600, 18700, 18800, 18900,
		19000, 19100, 19200, 19300, 19400, 19500, 19600, 19700, 19800, 19900,
		20000
	];

	number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	cePE = ['CE', 'PE'];
	bOrS = ['B', 'S'];

	onOptionChangeHandler = (event) => {
		this.setState({ [event.target.name]: parseInt(event.target.value) });
	}
	onOptionChangeHandlerCEPE = (event) => {
		this.setState({ [event.target.name]: event.target.value });

	}

	Remove = (numberIndex) => {
		let currentState = this.state;
		delete currentState["strike_" + numberIndex];
		delete currentState["price_" + numberIndex];
		delete currentState["ltPrice_" + numberIndex];
		delete currentState["buySell_" + numberIndex];
		this.setState(currentState);

		document.getElementById(numberIndex).remove();
	};

	save = () => {

		if (this.state.strtegyName != "") {
			localStorage.setItem(this.state.strtegyName, JSON.stringify(this.state));
		}
		localStorage.setItem("state", JSON.stringify(this.state));

	};

	allStorage() {

		var values = [],
			keys = Object.keys(localStorage),
			i = keys.length;

		while (i--) {
			values.push(localStorage.getItem(keys[i]));
		}

		return values;

	}

	drawGraph = (event) => {

		let finalJson = [];
		let finalJson2 = [];
		var lowerBreakevent = 0;
		var higherBreakevent = 0;
		var putsidePremium = 0;
		var callsidePremium = 0;
		for (let i = 0; i < this.options.length; i++) {
			let profit = 0;
			let currentPNL = 0;
			for (let j = 0; j < this.state.number.length; j++) {
				if (typeof this.state["price_" + j] != undefined) {
					let optionPrice = this.state["price_" + j];
					let optionStrike = this.state["strike_" + j];
					let buyOsell = this.state["buySell_" + j];
					let numberOfLot = (typeof this.state["numberOfLot_" + j] != undefined) ? this.state["numberOfLot_" + j] : 1;
					let ltPrice = (typeof this.state["ltPrice_" + j] != undefined) ? this.state["ltPrice_" + j] : this.state["price_" + j];

					let cepe = (typeof this.state["cepe_" + j] != undefined) ? this.state["cepe_" + j] : 'CE';
					if (this.options[i] == optionStrike && cepe === 'PE') {
						putsidePremium = putsidePremium + (optionPrice * numberOfLot * this.lotSize);
					}
					if (this.options[i] == optionStrike && cepe === 'CE') {
						callsidePremium = callsidePremium + (optionPrice * numberOfLot * this.lotSize);
					}
					if (this.options[i] < optionStrike && cepe === 'PE') {
						if (buyOsell === 'B') {
							profit = profit + ((optionStrike - this.options[i] - optionPrice) * this.lotSize * numberOfLot);
						} else {
							profit = profit + ((this.options[i] - optionStrike + optionPrice) * this.lotSize * numberOfLot);
						}
						currentPNL = currentPNL + ((optionPrice - ltPrice) * numberOfLot * this.lotSize);

					} else if (this.options[i] >= optionStrike && cepe === 'CE') {
						if (buyOsell === 'B') {
							profit = profit + ((- optionStrike + this.options[i] - optionPrice) * this.lotSize * numberOfLot);
						} else {
							profit = profit + ((-this.options[i] + optionStrike + optionPrice) * this.lotSize * numberOfLot);
						}

						currentPNL = currentPNL + ((optionPrice - ltPrice) * numberOfLot * this.lotSize);
					} else if (this.options[i] < optionStrike && cepe === 'CE') {
						if (buyOsell == 'B') {
							profit = profit - (optionPrice * this.lotSize * numberOfLot);
						} else {
							profit = profit + (optionPrice * this.lotSize * numberOfLot);
						}

						currentPNL = currentPNL + ((optionPrice - ltPrice) * numberOfLot * this.lotSize);
					} else if (this.options[i] >= optionStrike && cepe === 'PE') {
						if (buyOsell == 'B') {
							profit = profit - (optionPrice * this.lotSize * numberOfLot);
						} else {
							profit = profit + (optionPrice * this.lotSize * numberOfLot);
						}
						currentPNL = currentPNL + ((optionPrice - ltPrice) * numberOfLot * this.lotSize);

					}
				}
			}
			if (profit >= 0) {
				if (lowerBreakevent === 0) {
					lowerBreakevent = this.options[i];
				}
			}
			if (profit <= 0) {
				higherBreakevent = this.options[i];
			}
			finalJson.push({ x: this.options[i], y: profit, lineColor: profit < 0 ? 'red' : 'green' });
			finalJson2.push({ x: this.options[i], y: currentPNL, lineColor: currentPNL < 0 ? 'red' : 'green' });
		}

		this.setState({
			finalJson: finalJson, finalJson2: finalJson2, lowerBreakevent: lowerBreakevent,
			higherBreakevent: higherBreakevent,
			putsidePremium: putsidePremium,
			callsidePremium: callsidePremium
		});

	}
	callBack() {
		console.log("Loges");
	};
	makeRow(numberIndex) {
		let nameSelect = "strike_" + numberIndex;
		let cepe = "cepe_" + numberIndex;
		let buySell = "buySell_" + numberIndex;
		let price = "price_" + numberIndex;
		let ltPrice = "ltPrice_" + numberIndex;
		let numberOfLot = "numberOfLot_" + numberIndex;
		return (
			<div key={numberIndex} id={numberIndex}>
				<span style={{ marginRight: '10px', marginBottom: '5px' }}>
					<select name={nameSelect} onChange={this.onOptionChangeHandler} value={this.state[nameSelect]}>
						<option>Select</option>
						{this.options.map((option, index) => {
							return <option key={index} name="strike1" >
								{option}
							</option>
						})}
					</select>
				</span>
				<span style={{ marginRight: '10px', marginBottom: '5px' }}>
					<select name={cepe} onChange={this.onOptionChangeHandlerCEPE} value={this.state[cepe]}>
						<option>Select</option>
						{this.cePE.map((option, index) => {
							return <option key={index} >
								{option}
							</option>
						})}
					</select>
				</span>
				<span style={{ marginRight: '10px', marginBottom: '5px' }}>
					<select name={buySell} onChange={this.onOptionChangeHandlerCEPE} value={this.state[buySell]}>
						<option>Select</option>
						{this.bOrS.map((option, index) => {
							return <option key={index} >
								{option}
							</option>
						})}
					</select>
				</span>
				<span style={{ marginRight: '10px', marginBottom: '5px' }}>
					<label>Price</label>
				</span>
				<span style={{ marginRight: '10px' }}>
					<input type="number"
						name={price}
						value={this.state[price]}
						style={{ marginBottom: '5px', width: '80px' }}
						onChange={(e) => {
							this.setState({ [price]: parseInt(e.target.value) });
						}} />
				</span>
				<span style={{ marginRight: '10px', marginBottom: '5px' }}>
					<label>LTP Price</label>
				</span>
				<span style={{ marginRight: '10px' }}>
					<input type="number"
						name={ltPrice}
						value={this.state[ltPrice]}
						style={{ marginBottom: '5px', width: '80px' }}
						onChange={(e) => {
							this.setState({ [ltPrice]: parseInt(e.target.value) });
						}} />
				</span>
				<span style={{ marginRight: '10px', marginBottom: '5px' }}>
					<label>Lot</label>
				</span>
				<span style={{ marginRight: '10px' }}>
					<input type="number"
						name={numberOfLot}
						value={this.state[numberOfLot]}
						style={{ marginBottom: '5px', width: '80px' }}
						onChange={(e) => {
							this.setState({ [numberOfLot]: parseInt(e.target.value) });
						}} />
				</span>
				<span style={{ marginRight: '10px' }}>
					<button onClick={() => this.Remove(numberIndex)}>Remove</button>
				</span>
				<br />
			</div>
		)
	}
	componentDidMount() {
		let status = localStorage.getItem("state");
		let stateArr = JSON.parse(status);
		this.setState(stateArr);
		var dataArr = [];

		let localStore = this.allStorage();
		console.log("LocalStore");
		console.log(localStore);
		for (let i = 0; i < localStore.length; i++) {
			console.log("In Loop");
			let finalJson = JSON.parse(localStore[i]);
			console.log(i);
			console.log(finalJson.strtegyName);
			dataArr[i] = finalJson;
			//dataArr.push({finalJson: finalJson.finalJson, finalJson2: finalJson.finalJson2});
		}
		console.log("Test Data");
		console.log(dataArr);
		this.setState({ tableData: dataArr });
		console.log("TableData");
		console.log(this.state.tableData);
	}
	render() {

		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2",
			title: {
				text: "Profit Loss"
			},
			axisY: {
				title: "Profit & Loss",
				includeZero: false,
				suffix: ""
			},
			axisX: {
				title: "Option Strike Price",
				prefix: "",
				interval: 500
			},
			data: [{
				type: "line",
				toolTipContent: "{x}: {y}",
				dataPoints: this.state.finalJson
			},
			{
				type: "line",
				toolTipContent: "Current Profit Loss {x}: {y}",
				dataPoints: this.state.finalJson2
			}
			]
		}

		return (
			<div style={{ width: '764px' }}>
				<br />
				{this.state.number.map((option, index) => {
					return this.makeRow(index)
				})}
				<button style={{ marginRight: '10px' }} onClick={this.drawGraph}>Draw Graph</button>
				<input style={{ marginRight: '10px' }} type="text" name="strtegyName"
					value={this.state.strtegyName}
					onChange={(e) => {
						this.setState({ strtegyName: e.target.value });
					}} />
				<button style={{ marginRight: '10px' }} onClick={this.save}>Save Graph</button>
				<button onClick={() => {
					let anArray = this.state.number;
					var lastItem = anArray[anArray.length - 1];
					lastItem = lastItem + 1;
					anArray.push(lastItem);
					this.setState({ number: anArray }, this.callBack());
				}}>Add New</button>
				<br />
				<span>Lower breakEven: {this.state.lowerBreakevent}</span><br />
				<span>Higher breakEven: {this.state.higherBreakevent}</span><br />
				<span>Put Side Premium: {this.state.putsidePremium}</span><br />
				<span>Call Side Premium: {this.state.callsidePremium}</span><br />
				<CanvasJSChart options={options} />
				
				<div>
					{this.state.tableData.map((tbl, index) => {
						return <div><strong>{tbl.strtegyName}</strong><table style={{ borderCollapse: 'collapse' }} key={"tbl_" + index}>
							<tr>
								<td>Strike Price</td>
								<td>Price</td>
								<td>LT Price</td>
								<td>Buy/Sell</td>
							</tr>
							{tbl.number.map((tbl2, index2) => {
								return <tr key={index + "_row_" + index2}>
									<td key={index + "_col_" + index2}>{tbl["strike_" + tbl2]}</td>
									<td key={index + "_col_" + index2}>{tbl["price_" + tbl2]}</td>
									<td key={index + "_col_" + index2}>{tbl["ltPrice_" + tbl2]}</td>
									<td key={index + "_col_" + index2}>{tbl["buySell_" + tbl2]}</td>
								</tr>
							})}
						</table><br />
						</div>
					})}
				</div>
			</div>
		);
	}
}

export default LineChart;                           