import React, { useRef, useEffect } from 'react'
import { RecoilRoot } from 'recoil'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import { TransProvider } from 'use-mini18n'
import { i18n } from './configs/i18n'
import {
  Admin,
  Home,
  About,
  Login,
  Installation,
  Session,
  TimeTable,
  Tag,
} from './pages'
import { Head } from "./components/Head"
import { Container } from "./components/Container"
import { Splash } from "./components/Splash"
import { CoC } from './components/CoC'
import { Header } from './components/Header'
import { AgoraApp } from "./hooks/agoraApp"
import { ControllerSwitcher } from './components/Controller/'
import { Notification } from "./components/Notification"
import { Tutorial } from "./components/Tutorial"
import { CardMessageInput } from "./components/Card";
import 'sweetalert2/dist/sweetalert2.css'

const App = () => {
  const router = useRef(null)

  useEffect(() => {
    router.current.history.listen((location) => {
      window.gtag('config', process.env.GA_TRACKING_ID, {
        'page_path': location.pathname
      })
    })
  })

  return (
    <Router ref={router}>
      <RecoilRoot>
        <TransProvider i18n={i18n}>
          <Head />
          <Header />
          <Splash />
          <Tutorial />
          <CoC />
          <Notification />
          <Container>
            <Switch>
              <Route exact path="/"><Home /></Route>
              <Route exact path="/about"><About /></Route>
              <Route exact path="/installation/:id"><Installation /></Route>
              <Route exact path="/session/:id"><Session /></Route>
              <Route exact path="/timetable"><TimeTable /></Route>
              <Route exact path="/tag/:id"><Tag /></Route>
              <Route exact path='/admin'><Admin /></Route>
              <Route exact path="/login"><Login /></Route>
            </Switch>
          </Container>
          <CardMessageInput />
          <AgoraApp />
          <ControllerSwitcher />
        </TransProvider>
      </RecoilRoot>
    </Router>
  );
}

export default App
