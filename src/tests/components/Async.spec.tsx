import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react"

import { Async } from "../../components/Async"

test("it renders correctly", async () => {
  render(
    <Async />
  )

  expect(screen.getByText("Hello world")).toBeInTheDocument()

  await waitForElementToBeRemoved(screen.queryByText("Hello world"))
  
  await waitFor(() => {
    return expect(screen.getByText("Button")).toBeInTheDocument()
  })
})