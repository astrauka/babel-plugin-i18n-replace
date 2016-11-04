import React from "react";
import { render } from "react-dom";

var Greeting = React.createClass({
  render: function() {
    return (
      <div className="greeting">
        <p>
          {__t("greet.person", { name: "John" })}
        </p>
        <p>
          {__t("greet.anonymous")}
        </p>
      </div>
    );
  },
});

render(<Greeting/>, document.getElementById("react-component"));
