import useStored from "../../../store";

const LandingPage = () => {

    const count = useStored(state => state.count)
    const increment = useStored(state => (state.setIncrementCount))
    return (
        <div>
            Landing LandingPage
            <h1>{count}</h1>
            <button onClick={increment}>Increment</button>
        </div>
    )
}
export default LandingPage;