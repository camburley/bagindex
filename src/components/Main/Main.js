import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VictoryArea, VictoryBar, VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryPolarAxis, VictoryScatter, VictoryVoronoiContainer } from 'victory';
import moment from "moment";
import Marquee from '../Marquee/Marquee';







const Main = () => {
  const roundss = 'https://cors-anywhere.herokuapp.com/https://the645test.herokuapp.com/api/crunchbase_rounds'
  const investments = 'https://cors-anywhere.herokuapp.com/https://the645test.herokuapp.com/api/crunchbase_investments'
  const recentSuccess = 'https://api.producthunt.com/v1/posts/all?sort_by=votes_count&order=desc&search[featured]=true&per_page=50'
  const today = 'https://api.producthunt.com/v1/posts?day=2020-11-11'
  const aI = 'https://api.producthunt.com/v1/posts/all?search[Payments]=true&sort_by=votes_count&order=desc&per_page=50'
  const pastPosts = 'https://api.producthunt.com/v1/categories/topic-6/posts?days_ago=1'
  const specificDay = 'https://api.producthunt.com/v1/categories/topic-7/posts?day=2017-09-13'
  const topics = 'https://api.producthunt.com/v1/topics?older=13&per_page=5'
  let arr = [];
 

  const [cbData, setCbData] = useState({ data: 'none' })
  const [rounds, setRounds] = useState({ active: '', seed: false, a: false, b: false, c: false })

const dateFormatter = (item) => moment(item).format("MMM YY");


  function sortByProperty(property) {
    return function(a,b){
      if(a[property] > b[property])
      return 1;
      else if(a[property] < b[property])
      return -1;

      return 0;
    }
  }


  const getInvestmentData = async (data) => {
    let bucket = []
    axios.get(data)
    .then(res => {
      const block = res.data.crunchbase_investments
      const byDateArr = block.sort(sortByProperty("funded_at"));
      byDateArr.map( row => {
      row.raised_amount_usd === null ? console.log('found one') : bucket.push(row)
      })
      setCbData((prevState) => {return{...prevState, cb_investments: bucket}})
    })
    .catch((error) => {
      console.error('🚨 whoa whoa whoa...', error)
    })
  }

  // const getRoundsData = async (data) => {
  //   console.log('🥶 3. data', data)
  //   axios.get(data)
  //   .then(res => {
  //     const block = res.data.rounds
  //     const byDateArr = block.sort(sortByProperty("funded_at"));
  //     console.log('🏛 byDateArr', byDateArr)
  //     setCbData((prevState) => {return{...prevState, cb_rounds: byDateArr}})
  //     console.log('cbData.cb_rounds', cbData.cb_rounds )
  //   })
  //   .catch((error) => {
  //     console.error('🚨 whoa whoa whoa...', error)
  //   })
  // }



  const drawGraph =  () => {
    let dataObj={} 
    let seedRound = []
    let seriesA = []
    let seriesB = []
    let privateEquity= []
    cbData.cb_investments.map( row => {
      const whenFunded = row.funded_at
      const investmentAmount = row.raised_amount_usd
      const invest = JSON.parse(investmentAmount)
      const roundRaised = row.funding_round_type
      const object = { 'x': dateFormatter(whenFunded), 'y': JSON.parse(invest) }
      roundRaised === 'angel' || roundRaised === 'other' ? seedRound.push(object) : console.log('not angel')
      roundRaised === 'series-a' || roundRaised === 'venture' ? seriesA.push(object) : console.log('not a')
      roundRaised === 'series-b' ? seriesB.push(object) : console.log('not b')
      roundRaised === 'series-c+' || roundRaised === 'private-equity' ? privateEquity.push(object) : console.log('not angel')
    })

    const addData = (arg) => {
      const newValue = arg
      return newValue
    }

    const array = rounds.active === '' ? seedRound : rounds.active 

    return(
      <div style={{ width: '90%'}}>
      <button onClick={() => setRounds((prevState) => {return { ...prevState, active: seedRound }}) } >{'Seed Round Funding'}</button>
      <button onClick={ () => setRounds((prevState) => {return { ...prevState, active: seriesA }}) }>{'Series A Round Funding'}</button>
      <button onClick={() =>  setRounds((prevState) => {return { ...prevState, active: seriesB }}) }>{'Series B Round Funding'}</button> 
      <button onClick={() =>  setRounds((prevState) => {return { ...prevState, active: privateEquity }}) }>{'Series C Round Funding'}</button>

     { 
      
      <VictoryChart
          theme={VictoryTheme.material}
          height={400}
          width={1000}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => `${datum.x}, $${Math.round(datum.y/1000000, 2)}M`}
            />
          }
        >
        <VictoryAxis style={{ labels: {fill: '#00FF80'}  }} tickValues={[1, 2, 3, 4]} />
        {/* <VictoryAxis style={{ fill: '#ffffff' }} dependentAxis tickFormat={(tick) => `$${Math.round(tick/1000000)}M`}/> */}
      <VictoryArea
        //  interpolation="natural"
        data={addData(array)}
        symbol="star"
        style={{
          data: {
            fill: "#13b7d6", fillOpacity: 0.1, stroke: "#13b7d6", strokeWidth: 3
          },
          labels: {
            fontSize: 15,
            fill: "#000000" 
          }
        }}
      />
      </VictoryChart>
      }
      </div>
      )
  }


  useEffect(() => {
    getInvestmentData(investments)
  }, [])

  return (
    <div style={{ backgroundColor: '#27364d',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '5%', }}>
      <div  className="App-header">
        
        <Marquee 
        description={' The Bag Index helps entrepreneurs understand the overall health of the venture capital funding environment, across rounds. We calculate the Index by combining crunchbase sources from the distant past including, VC funds raised, deal volume, M&A, and IPOs. '}/>
        { cbData.cb_investments ? drawGraph() : ''}
      </div>
    </div>
  );
  
}

export default Main;