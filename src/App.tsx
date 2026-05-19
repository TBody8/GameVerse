import { Switch, Route } from 'wouter'
import HomePage from '@/pages/HomePage'
import GamePage from '@/pages/GamePage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game/:gameId" component={GamePage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}
