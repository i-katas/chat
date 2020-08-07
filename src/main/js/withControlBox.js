import React from "react";
import string from "./string";

export default function withControlBox({type, field, button}) {
    return class extends React.Component {
        state = {value: ''}

        render() {
            let {value} = this.state
            return (
                <div className={type}>
                    {field(value, (event) => this.setState({value: event.target.value}), this.props)}
                    {button(value, string.isBlank(value), this.reset, this.props)}
                </div>
            )
        }

        reset = () => this.setState({value: ''})
    }
}

