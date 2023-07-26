import {Helmet} from 'react-helmet-async';
const Meta = ({title, descripiton, keywords}) => {
  return (
      <Helmet>
          <title>{title}</title>
          <meta name='description' content={descripiton}/>
          <meta name='keywords' content={keywords}/>
    </Helmet>
  )
}

Meta.defaultProps= {
    title: 'Welcome to Proshop',
    descripiton: "We sell the best products for cheap",
    keywords: 'electronis, cheap, fast'
}

export default Meta