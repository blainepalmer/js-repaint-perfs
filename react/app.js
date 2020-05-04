/** @jsx React.DOM */

var DBMon = React.createClass({
  getInitialState: function() {
    return {
      databases: []
    };
  },

  loadSamples: function (event) {
    if(event.data != 'testPM') return;
    this.setState({ databases: ENV.generateData().toArray() });
    Monitoring.renderRate.ping();
    window.postMessage('testPM', '*')
  },

  componentDidMount: function() {
    window.addEventListener('message', this.loadSamples, false);
    window.postMessage('testPM', '*')
  },

  render: function() {
    return (
      <div>
        <table className="table table-striped latest-data">
          <tbody>
            {
              this.state.databases.map(function(database) {
                return (
                  <tr key={database.dbname}>
                    <td className="dbname">
                      {database.dbname}
                    </td>
                    <td className="query-count">
                      <span className={database.lastSample.countClassName}>
                        {database.lastSample.nbQueries}
                      </span>
                    </td>
                      {
                        database.lastSample.topFiveQueries.map(function(query, index) {
                          return (
                            <td className={ "Query " + query.elapsedClassName}>
                              {query.formatElapsed}
                              <div className="popover left">
                                <div className="popover-content">{query.query}</div>
                                <div className="arrow"/>
                              </div>
                            </td>
                          );
                        })
                      }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
});

ReactDOM.render(<DBMon />, document.getElementById('dbmon'));
