import React from 'react';
import Hero from '../Hero/Hero';
import LandingNav from '../LandingNav/LandingNav';
import PatternOne from '../Services/PatternOne';
import PatternTwo from '../Services/PatternTwo';
import ServicesHeader from '../Services/ServicesHeader';
import image1 from '../svgs/undraw_quiz_nlyh 1.svg';
import image2 from '../svgs/undraw_Scrum_board_re_wk7v (1) 2.svg';
import image3 from '../svgs/undraw_Work_chat_re_qes4 (1) 1.svg';
import image4 from '../svgs/undraw_data_report_bi6l 1.svg';
import Reviews from '../Reviews/Reviews';
import Footer from '../Footer/Footer';

import './Home.css';

const Home = () => {
  return (
    <>
      <LandingNav />
      <Hero />
      <ServicesHeader />
      <div className='Home'>
        <PatternOne
          title='Divide your task into multiple Boards'
          subtitle='Make different boards according to your needs and manage your task
          easily.'
          patternImage={image1}
          id='backlog'
        />
        <PatternTwo
          title='Kanban Makes Everything Easier'
          subtitle='Use Kanban board to keep track of your tasks dividing it into pending, ongoing and completed status.'
          patternImage={image2}
          id='kanban'
        />
        <PatternOne
          title='Draw, Chat, Collaborate!'
          subtitle='The Collab Whiteboard allows you to draw, write, add pictures and much more with your team members in the perfect virtual environment to work together in real-time.'
          patternImage={image3}
          id='collab'
        />

        <PatternTwo
          title='Boost your productivity by monitoring reports'
          subtitle='The Report tab helps you keep track of your progress and show the statistics of you and your team in a visually pleasing way'
          patternImage={image4}
          id='reports'
        />
        <Reviews />
      </div>
      <Footer />
    </>
  );
};

export default Home;