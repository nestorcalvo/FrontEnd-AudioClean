import GitHubIcon from '@material-ui/icons/GitHub'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { about } from '../../portfolio'
// import { Denoise } from '../../pages/Denoise'
import './About.css'

const About = () => {
  const { role, description, description2 } = about
  return (
    <div className='about center'>
      <h1>
        Audio <span className='about__name'>DENOISING</span>
      </h1>
      {/* {name && (
      )} */}

      <p className='about__desc'>{description && description}</p>
      <p className='about__desc'>
        <a
          href='http://www.interspeech2020.org/uploadfile/pdf/Mon-3-3-4.pdf'
          target='blank'
        >
          {description2 && description2}
        </a>
      </p>

    </div>
  )
}

export default About
