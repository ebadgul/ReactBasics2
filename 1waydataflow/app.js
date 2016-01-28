var ReactDOM = require('react-dom') ;
var React = require('react') ;
var request = require('superagent') ; 

var FriendListItem = React.createClass({
    render : function() {
         return (
           <li> 
              <h2>{this.props.friend.name}</h2> 
               <a href={'mailto:'+this.props.friend.email}>
                     {this.props.friend.email} </a>
            </li>
           )
    }
});

var FriendList = React.createClass({
    render : function() {
        var items = this.props.list.map(function(item) {
               return <FriendListItem key={item.email} friend={item} />
           });
        return (
          <ul>
             {items}
           </ul>
          )
    }
});

var FiltetedFriends = React.createClass({
    getInitialState : function() {
        return {
            searchText : ''
      }
    },
    componentDidMount : function() {
         var that = this ;
         request.get('http://localhost:3000/friends')
            .end(function(error, res){
              if (res) {
                var json = JSON.parse(res.text);
                localStorage.clear();
                localStorage.setItem('friends', JSON.stringify(json)) ;
                this.setState( {}) ;
              } else {
                console.log(error );
              }
            }.bind(this)); 
    },
    filterFriends : function(event) {
        event.preventDefault() ;
        this.setState({searchText : 
             event.target.value.toLowerCase()});
    },
    render: function(){
        var updatedList = localStorage.getItem('friends') ?
                  JSON.parse(localStorage.getItem('friends')) : [] ;
        updatedList = updatedList.filter(function(item){
               return item.name.toLowerCase().search(
                   this.state.searchText) !== -1 ;                
         }.bind(this) );
        return (
          <div>
             <h1>Friends List</h1>
             <input type="text" placeholder="Search" 
                onChange={this.filterFriends} />
             <FriendList list={updatedList} />
          </div>
        );
    }
});

ReactDOM.render(
    <FiltetedFriends/>,
    document.getElementById('mount-point')
); 