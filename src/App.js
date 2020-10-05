import React, { Component } from 'react';
import './App.css';
import ReactPaginate from 'react-paginate';
class App extends Component {

  state = {
    data: [],
    dataView: [{views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}, {views:'loading'}],
    page: 1,
  }

  getData(page) {
    fetch(`https://api.unsplash.com/photos?page=${page}&client_id=XFeQtpPMCW5UscDzwShwWk__DcnllMGZE7G-uv3OrZ8`)
      .then(response => response.json())
      .then(response => {this.setState({ data: response }); })
      .catch(error => console.log(error))
  }

  getView(page) {
    async function getD() {
      const ids = await (await fetch(`https://api.unsplash.com/photos?page=${page}&client_id=XFeQtpPMCW5UscDzwShwWk__DcnllMGZE7G-uv3OrZ8`)).json();
      const data = Promise.all(
        ids.map(async (obj) => await (await fetch(obj.links.self + '?client_id=XFeQtpPMCW5UscDzwShwWk__DcnllMGZE7G-uv3OrZ8')).json())
      )
      return data
    }

    getD()
      .then((key)=> {
        this.setState({dataView:key})
      })
  }

  componentDidMount() {
    this.getData(this.state.page);
    this.getView(this.state.page); 
  }

  onClick(link){
    window.open(link, '_blank');
  }

  handlePageClick = (page) => {    
    let thisPage = page.selected + 1;

    this.setState({
      page: thisPage,
    })

    this.getData(thisPage);
    this.getView(thisPage);
  }




  render() {    
    return (
      <>
          <div className='container'>
          {this.state.data.map((photo, i) => (
            <div key={Math.random()}>            
              <div className='photoHeader'>
                <div className='profilePhoto' onClick={() => this.onClick(photo.user.links.html)}> 
                  <img src={photo.user.profile_image.small} alt='photoFromUnsplash' />
                </div>
                <div className='userName' onClick={() => this.onClick(photo.user.links.html)}>
                  {photo.user.name} <br/>
                  <div style={{opacity: '.5'}}>{'@' + photo.user.instagram_username}</div>
                </div>
              </div>
              <div className='singleImg' >
                <img src={photo.urls.regular} alt='photoFromUnsplash' />            
              </div>
              <div className='bottomText'>{this.state.dataView[i].views} 👁‍🗨 </div>
            </div>
          ))}
        </div>
        <ReactPaginate
          previousLabel={'l'}
          nextLabel={'l'}
          breakLabel={'...'}
          breakClassName={'page-item'}
          pageCount={6}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          disabledClassName={'disable'}

        />
      </>
    );
  }
}

export default App;
