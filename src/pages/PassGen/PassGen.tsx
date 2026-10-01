import { useRef, useState } from 'react'

import GenerateWorker from '../../components/Generate/generate.worker.ts?worker';

import { Eye, X } from 'lucide-react';
import { defaultSettings, getCharset, type GenerateSettings } from '../../components/Generate/generate';
import { Title } from '../../components/Title/Title';
import { Input } from '../../components/Input/Input';
import { Button } from '../../components/Button/Button';
import { SettingsModal } from '../../components/Modal/SettingsModal';
import { AnimatedLabel } from '../../components/Button/AnimatedLabel';


function PassGen() {

  const [masterKey, setMasterKey] = useState('');
  const [key, setKey] = useState('');
  const [tag, setTag] = useState('');
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<GenerateSettings>(defaultSettings);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [titleTrigger, setTitleTrigger] = useState(0);

  const handleEditMasterKey = (value: string) =>
  {
    setMasterKey(value);
  }

  const handleEditKey = (value: string) =>
  {
    setKey(value);
  }

  const handleEditTag = (value: string) =>
  {
    setTag(value);
  }

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatePassword = async () =>
  {
    const alphabetError = getCharset(settings).length === 0;

    if (masterKeyError || keyError || alphabetError || !masterKey || !key) {
      const msg = !masterKey || !key ? 'Fill fields' : alphabetError ? 'Choose alphabet' : 'Fix errors';
      setErrorMsg(msg);
      if (errorTimer.current) clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => setErrorMsg(''), 5_000);
      return;
    }
    setLoading(true);
    setTitleTrigger(prev => prev + 1);
    const pass = await new Promise<string>((resolve) => {
      const worker = new GenerateWorker();
      worker.onmessage = (e: MessageEvent<string>) => {
        resolve(e.data);
        worker.terminate();
      };
      worker.postMessage({ masterKey, key, tag, params: settings } satisfies { masterKey: string; key: string; tag: string; params: GenerateSettings });
    });
    setLoading(false);
    setErrorMsg('');
    if (errorTimer.current) clearTimeout(errorTimer.current);
    setPassword(pass);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setPassword(''), 30_000);
  }

  const masterKeyError = masterKey.length > 0 && (masterKey.includes(' ') || masterKey.length < 6);
  const keyError = key.length > 0 && (key.includes(' ') || key.length < 2);

  const handleReset = () =>
  {
    setMasterKey('');
    setKey('');
    setTag('');
    setPassword('');
  }


  return (
    <div className="bg-bg min-h-screen w-full flex flex-col justify-center py-8 px-4 md:px-28 lg:px-64 xl:px-60">

      <Title trigger={titleTrigger} defaultText='pass-gen'/>

      <div className='flex flex-col gap-12 justify-center py-6 px-4 bg-surface rounded-xl md:p-8'>
        <div className='w-full flex flex-col gap-6 justify-center'>
          <Input
            value={masterKey}
            onChange={handleEditMasterKey}
            placeholder='Master password*'
            type='password'
            rightAddon={['visible', 'clear']}
            error={masterKeyError}
            disabled={loading}
          />
          <Input
            value={key}
            onChange={handleEditKey}
            placeholder='Key*'
            error={keyError}
            disabled={loading}
            rightAddon='clear'
          />
          <Input
            value={tag}
            onChange={handleEditTag}
            placeholder='Tag'
            disabled={loading}
            rightAddon='clear'
          />
        </div>

        <div className='flex gap-2 w-full'>
          <Button onClick={generatePassword} className='w-full'>
            {loading 
              ? <Eye size={30} strokeWidth={3} className='animate-spin text-accent'/> 
              : <AnimatedLabel text={errorMsg || 'Generate'} error={!!errorMsg} />
            }
          </Button>
          <SettingsModal settings={settings} onChange={setSettings} disabled={loading} />
          <Button onClick={handleReset} className='w-fit bg-accent! text-primary! active:text-text-dark! active:bg-muted! hover:text-text-dark!' disabled={loading}>
            <X size={30} strokeWidth={3}/>
          </Button>
        </div>

        <Input
          value={password}
          placeholder='Wait ur password'
          rightAddon='copy'
          disabled
          className=''
        />
      </div>

      
    </div>
  )
}

export default PassGen
