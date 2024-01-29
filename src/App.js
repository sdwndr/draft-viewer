import './App.css';
import { useState, useMemo } from 'react';
import cards from './cards.json'

const textToPitch = {
  '(red)': 1,
  '(yellow)': 2,
  '(blue)': 3
}

function App() {
  const [file, setFile] = useState();
  const [fileContents, setFileContents] = useState()

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const viewDraft = () => {
    const textType = /text.*/;
    if (!file.type.match(textType) || !file) {
      alert('Draftmancer Text File Please')
      return
    }


    const reader = new FileReader()
    reader.onload = async (e) => { 
      setFileContents(reader.result)
    };

    reader.readAsText(file)
  }


  const parsedFileContents = useMemo(() => {
    if (!file || !fileContents) {
      return
    }

    const result = fileContents?.split('\n\n')
    const drafters = result.shift().split('\n').slice(3)

    const packs = result.filter((item) => item.startsWith('Pack') )
    const pack1 = packs.splice(0, 14)
    const pack2 = packs.splice(0, 14)
    const pack3 = packs

    const draftersWithOrder = (direction) => {
      if (direction === 'left') {

      }
      
      return <div className="font-bold flex">
        {drafters.map((drafter, i) => {
        let drafterCopy = drafter
        
        if (i !== drafters.length - 1) {
          drafterCopy += '  -->'
        }

        if (drafter.startsWith('-->')) {
          return <div className="text-green-500 pr-1">{drafterCopy.slice(4)}</div>
        }
        
        return <div className="pr-1">{drafterCopy}</div>
      })}
      </div>
    }

    const showPacks = (pack) => {
      const splitCardAndPitch = (line) => {
        if (line.includes('(')) {
          const [card, pitch] = line.split(/\s(?=\()/)
          return [card.trim(), textToPitch[pitch]]
        }

        return [line.trim(), null]
      }

      const findCard = (cardName, pitch) => cards.find((card) => card.name === cardName && card.pitch === pitch)
      
      return <>
        {pack.map((singlePack, i) => {
            const cardList = singlePack.split('\n')

            return <div className='flex flex-wrap'>{cardList.map((line, i) => {  
              if (i === 0) {
                return <div className="mt-8 basis-full text-xl font-bold">{line}</div>
              }
              
              if (line.startsWith('-->')) {
                const cleanLine = line.replace('--> ', '')
                const [cardName, pitch] = splitCardAndPitch(cleanLine)
                return <div className="text-green-500"><img className={`inline-block h-64 w-44 m-1 hover:scale-150 transition duration-200 border-green-500 border-4 rounded-lg`} src={`https://d2h5owxb2ypf43.cloudfront.net/cards/${findCard(cardName, pitch).image}.webp`}></img></div>
              }

              const [cardName, pitch] = splitCardAndPitch(line)
              return <div>
                <div><img className={`inline-block h-64 w-44 m-1 hover:scale-150 transition duration-200`} src={`https://d2h5owxb2ypf43.cloudfront.net/cards/${findCard(cardName, pitch).image}.webp`}></img></div>
                {/* <div>{findCard(cardName, pitch).image}</div> */}
                </div>
          })}</div>
        })}
      </>
    }

    return <>
      {draftersWithOrder('right')}
      {showPacks(pack1)}
      {showPacks(pack2)}
      {showPacks(pack3)}
    </>
  }, [file, fileContents])



  return (
    <div className="p-4 text-center text-gray-200 bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-fit p-4 flex flex-col items-center">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
        <input onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />

        <button className="m-2 mt-4 p-2 max-w-40 bg-slate-600" onClick={viewDraft}>View Draft</button>
      </div>

      {fileContents ? parsedFileContents : ''}
    </div>
  );
}

export default App;
