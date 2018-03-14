'use babel'
// Copyright 2018 Etheratom Authors
// This file is part of Etheratom.

// Etheratom is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Etheratom is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Etheratom.  If not, see <http://www.gnu.org/licenses/>.
import React from 'react'
import { connect, Provider } from 'react-redux'
import ContractCompiled from '../ContractCompiled'
import ContractExecution from '../ContractExecution'
import { addInterface } from '../../actions'

class Contracts extends React.Component {
    constructor(props) {
        super(props);
        this.helpers = props.helpers;
    }
    render() {
        const { compiled, deployed, compiling, interfaces } = this.props;
        return (
            <Provider store={this.props.store}>
                <div id="compiled-code" class="compiled-code">
                    {
                        compiled &&
                        Object.keys(compiled.contracts).map((contractName, index) => {
                            const bytecode = compiled.contracts[contractName].bytecode;
                            const ContractABI = JSON.parse(compiled.contracts[contractName]["interface"]);

                            return (
                                // If not execution view show contracts else show execution
                                <div id={contractName} class="contract-container">
                                    {
                                        !deployed[contractName] && interfaces !== null && interfaces[contractName] && compiling === false &&
                                        <ContractCompiled
                                            contractName={contractName}
                                            bytecode={bytecode}
                                            index={index}
                                            helpers={this.helpers}
                                        />
                                    }
                                    {
                                        deployed[contractName] &&
                                        <ContractExecution
                                            contractName={contractName}
                                            bytecode={bytecode}
                                            index={index}
                                            helpers={this.helpers}
                                        />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Provider>
        );
    }
}

const mapStateToProps = ({ contract }) => {
	const { compiled, deployed, compiling, interfaces } = contract;
	return { compiled, deployed, compiling, interfaces };
}

export default connect(mapStateToProps, { addInterface })(Contracts);