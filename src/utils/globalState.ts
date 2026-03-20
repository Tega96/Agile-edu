// import { createSlice, configureStore } from '@redux/toolkit'

// const useSlice = createSlice({
//     name: 'user',
//     initialValues: {name: '', isLoggedIn: false},
//     reducer: {
//         login: (state, action) => {
//             state.name = action.payload
//             state.isLoggedIn = true
//         }
//     }
// })

// const userName = useSelector(state => state.name.user)
// const dispatch = useDispatch()

// dispatch(login('John'))



// // Zustand
// import { create } from 'zustand'

// interface UseStore {
//     user: String;
//     friends: String[]
//     salary: Number
//     setUser: () => {}
//     logout: () => {}
// }

// const useStore = create<UseStore>((set) => ({
//     user: null,
//     friends: ['John', 'Mary', 'Elizabeth', 'Martha'],
//     salary: 377,
//     setUser: (userData: string) => set({ user: userData}),
//     logout: () => set({ user: null})
// }))



// const {user, setUser } = useStore();


// // Redux 
// import {createSlice, configureStore} from '@redux/toolkit',

// const useStore = createSlice({
//     name: 'user',
//     initialValue: {name: '', isLoggedIn: false},
//     reducer: {
//         login: (state, action) => {
//             state.name = action.payload
//             state.isLoggedIn = true
//         }
//     }
// })

// const userName = useSelector(state.name.user)
// const dispatch = useDispatch()

// dispatch(login('John'))

// // Zustand

// import { create } from 'zustand'

// const useStores = create((set) => ({
//     user: null,
//     setUser: (userData) => set({ user: userData }),
//     logout: () => set({ user: null})
// }))

// const {user, setUser} = useStores();




// // Context Api
// const UserContext = React.createContext()

// <UserContext.Provider value={{ user, setUser }} >
//     <App />
// </UserContext.Provider>


// const { user } = useContext(UserContext)


// {
//     user: {id: 1, name: 'John', email: 'john@exmaple.com'}
//     isAuthenticated: true,
//     permissions: ['read', 'write']
// }

// // App settings/theme

// {
//     theme: 'dark',
//     language: 'en',
//     notification: true
// }

// // Shopping cart
// {
//     items: [...],
//     total: 99.99,
//     itemCount: 3
// }

// // Cached Api
// {
//     products: [...],
//     lastFetched: timestamp,
//     loading: false
// }