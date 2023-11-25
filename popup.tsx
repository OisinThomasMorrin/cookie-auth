import React, { useEffect, useState } from 'react'
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

const popup = () => {
  const storage = new Storage()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useStorage("user", null)

  /**
 * Asynchronously retrieves the user's cookie from the Chrome browser and the local storage.
 * If the cookie exists, it checks if the stored cookie is the same as the current cookie.
 * If they are not the same, it updates the user's cookie.
 * If the cookie does not exist, it sets the user to null and clears the Chrome storage.
 * Finally, it sets the loading state to false.
 *
 * @async
 * @function getCookie
 */
  async function getCookie() {

    let currentCookie: chrome.cookies.Cookie | string | null = await chrome.cookies.get({ "url": "https://localhost:5173", "name": "user-token" });
    let currentStoredCookie = await storage.get("user")
    if (currentCookie) {
      currentCookie = currentCookie.value
      if (currentStoredCookie !== currentCookie) {
        setUser(currentCookie)
      }
    }
    else {
      setUser(null)
      await chrome.storage.sync.clear();
    }
    setLoading(false)
  }

  useEffect(() => {
    getCookie()
  }, [])

  if (loading || user === null) return (<div>Loading...</div>)

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        alignItems: "center",
        width: "200px",
        height: "300px",
        justifyContent: "center",
      }}
    >

      {!!user && (
        <>
          <h5>Hi, {user}</h5>
          <button
            title="Log out"
            onClick={async () => {
              await chrome.storage.sync.clear();
              await chrome.cookies.remove({ "url": "https://localhost:5173", "name": "user-token" });
            }}
          >
            Logout
          </button>
        </>
      )}
      {!user && (
        <>
          <button
            title="Sign in or Sign up"
            onClick={() => {
              chrome.tabs.create({ url: "http://localhost:5173" });
            }}
          >
            Sign in or Sign up
          </button>
        </>
      )}

    </div>

  )
}

export default popup