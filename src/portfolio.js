import BACKEND_URL from './constants'

const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://gita.udea.edu.co/',
  title: 'GITA',
}

const about = {
  // all the properties are optional - can be left empty or deleted
  description:
    'This is a web application that allows the user to make use of a Deep Learning model called ORCA-CLEAN [1], created to perform audio cleaning for whales, and merge it in such a way that the user can perform audio cleaning without having knowledge of the model and just making use of his mouse and keyboard, the user can select multiple regions in order to apply different types of parameters and make comparisons, as well as listen to the resulting audio(s) after applying the cleaning process, finally the user can download a zip folder containing images of the spectrogram of the regions before and after cleaning, as well as the cleaned audio(s).',
  description2:
    '[1] Bergler, C., Schmitt, M., Maier, A., Smeele, S., Barth, V., & Nöth, E. (2020). ORCA-CLEAN: A Deep Denoising Toolkit for Killer Whale Communication. Proc. Interspeech 2020, 1136-1140.',
}

const input = [
  // projects can be added an removed
  // if there are no projects, Projects section won't show up
  {
    name: 'Img 1',
    // description:
    //   'Amet asperiores et impedit aliquam consectetur? Voluptates sed a nulla ipsa officia et esse aliquam',
    image_src: `${BACKEND_URL}/media/default/net_input_spec_0_1.pdf`,
    // stack: ['SASS', 'TypeScript', 'React'],
    // sourceCode: 'https://github.com',
    // livePreview: 'https://github.com',
  },
  {
    name: 'Img 2',
    // description:
    //   'Amet asperiores et impedit aliquam consectetur? Voluptates sed a nulla ipsa officia et esse aliquam',
    image_src: `${BACKEND_URL}/media/default/net_input_spec_0_2.pdf`,
    // stack: ['SASS', 'TypeScript', 'React'],
    // sourceCode: 'https://github.com',
    // livePreview: 'https://github.com',
  },
  {
    name: 'Img 3',
    // description:
    //   'Amet asperiores et impedit aliquam consectetur? Voluptates sed a nulla ipsa officia et esse aliquam',
    image_src: `${BACKEND_URL}/media/default/net_input_spec_0_3.pdf`,
    // stack: ['SASS', 'TypeScript', 'React'],
    // sourceCode: 'https://github.com',
    // livePreview: 'https://github.com',
  },
]

const output = [
  // projects can be added an removed
  // if there are no projects, Projects section won't show up
  {
    name: 'Img 1',
    // description:
    //   'Amet asperiores et impedit aliquam consectetur? Voluptates sed a nulla ipsa officia et esse aliquam',
    image_src: `${BACKEND_URL}/media/default/net_out_spec_0_1.pdf`,
    // stack: ['SASS', 'TypeScript', 'React'],
    // sourceCode: 'https://github.com',
    // livePreview: 'https://github.com',
  },
  {
    name: 'Img 2',
    // description:
    //   'Amet asperiores et impedit aliquam consectetur? Voluptates sed a nulla ipsa officia et esse aliquam',
    image_src: `${BACKEND_URL}/media/default/net_out_spec_0_2.pdf`,
    // stack: ['SASS', 'TypeScript', 'React'],
    // sourceCode: 'https://github.com',
    // livePreview: 'https://github.com',
  },
  {
    name: 'Img 3',
    // description:
    //   'Amet asperiores et impedit aliquam consectetur? Voluptates sed a nulla ipsa officia et esse aliquam',
    image_src: `${BACKEND_URL}/media/default/net_out_spec_0_3.pdf`,
    // stack: ['SASS', 'TypeScript', 'React'],
    // sourceCode: 'https://github.com',
    // livePreview: 'https://github.com',
  },
]

const skills = [
  // skills can be added or removed
  // if there are no skills, Skills section won't show up
  // 'HTML',
  // 'CSS',
  // 'JavaScript',
  // 'TypeScript',
  // 'React',
  // 'Redux',
  // 'SASS',
  // 'Material UI',
  // 'Git',
  // 'CI/CD',
  // 'Jest',
  // 'Enzyme',
]

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: 'nestor.calvo@udea.edu.co',
}

export { header, about, input, output, skills, contact }
