import {useState} from 'react';

import {GoDatabase} from "react-icons/go";
import CodeSnippet from "./CodeSnippet.jsx";

const Server = () => {

    const [useNodemon, setNodemon] = useState(false)
    const [useJwt, setJwt] = useState(false)
    const [useStripe, setStripe] = useState(false)
    const [useVercel, setVercel] = useState(false)
    const [useDeploy, setDeploy] = useState(false)
    const [useExpress, setExpress] = useState(false)

    function copyToClipboard(id, btnId) {
        const textToCopy = document.getElementById(id).innerText
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                console.log('Text copied to clipboard')
            })
            .catch((err) => {
                console.error('Error copying text: ', err)
            })

        document.getElementById(btnId).classList.add('tooltip')
    }
    const [projectName, setProjectName] = useState('my-project')

    function packageNameCorrector(packageName) {
        packageName = packageName.toLowerCase();
        packageName = packageName.replace(/\s+/g, '-');
        packageName = packageName.replace(/[^a-z0-9-_]/g, '');
        return packageName;
    }

    const codeString = `
    const express = require('express');
    const app = express();
    require('dotenv').config();
    const cors = require('cors');
    const cookieParser = require('cookie-parser');
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
    const jwt = require('jsonwebtoken');
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const port = process.env.PORT || 5000;

    const corsOptions = {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174'
        ],
        credentials: true,
        optionSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());

    const verifyToken = async (req, res, next) => {
        const token = req.cookies?.token;
        console.log(token);
        if (!token) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: 'unauthorized access' });
            }
            req.user = decoded;
            next();
        });
    };

    const uri = \`mongodb+srv://{process.env.DB_USER}:{process.env.DB_PASS}@cluster0.q3baw43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0\`;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    async function run() {
        try {
            const db = client.db('${projectName ? projectName : 'DBname'}');
            const usersCollection = db.collection('users');

            const verifyAdmin = async (req, res, next) => {
                const user = req.user;
                const query = { email: user?.email };
                const result = await usersCollection.findOne(query);
                console.log(result?.role);
                if (!result || result?.role !== 'admin')
                    return res.status(401).send({ message: 'unauthorized access!!' });
                next();
            };

            const verifyHost = async (req, res, next) => {
                const user = req.user;
                const query = { email: user?.email };
                const result = await usersCollection.findOne(query);
                console.log(result?.role);
                if (!result || result?.role !== 'host') {
                    return res.status(401).send({ message: 'unauthorized access!!' });
                }
                next();
            };

            app.post('/jwt', async (req, res) => {
                const user = req.body;
                const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '365d',
                });
                res
                    .cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                    })
                    .send({ success: true });
            });

            app.get('/logout', async (req, res) => {
                try {
                    res
                        .clearCookie('token', {
                            maxAge: 0,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                        })
                        .send({ success: true });
                    console.log('Logout successful');
                } catch (err) {
                    res.status(500).send(err);
                }
            });

            app.post('/create-payment-intent', verifyToken, async (req, res) => {
                const salary = req.body.salary;
                const salaryInCent = parseFloat(salary) * 100;
                if (!salary || salaryInCent < 1) return;
                const { client_secret } = await stripe.paymentIntents.create({
                    amount: salaryInCent,
                    currency: 'usd',
                    payment_method_types: ['card'],
                });
                res.send({ clientSecret: client_secret });
            });

            app.put('/user', async (req, res) => {
                const user = req.body;

                const query = { email: user?.email };
                const isExist = await usersCollection.findOne(query);
                if (isExist) {
                    return res.send(isExist);
                }
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        ...user,
                        timestamp: Date.now(),
                    },
                };
                console.log(updateDoc);
                const result = await usersCollection.updateOne(query, updateDoc, options);
                res.send(result);
            });

            app.get('/user/:email', async (req, res) => {
                const email = req.params.email;
                const result = await usersCollection.findOne({ email });
                res.send(result);
            });

            app.get('/users', verifyToken, async (req, res) => {
                const result = await usersCollection.find().toArray();
                res.send(result);
            });

            app.patch('/users/update/:email', verifyToken, async (req, res) => {
                const email = req.params.email;
                const user = req.body;
                const query = { email };
                const updateDoc = {
                    $set: { ...user, timestamp: Date.now() },
                };
                console.log(updateDoc);
                const result = await usersCollection.updateOne(query, updateDoc);
                res.send(result);
            });

            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        } finally {
        }
    }
    run().catch(console.dir);

    app.get('/', (req, res) => {
        res.send('Server is Running...');
    });

    app.listen(port, () => {
        console.log(\`Server is Running on port {port}\`);
    });
  `;

    return (
        <div className='p-4 lg:p-8'>

            <p className="text-4xl lg:text-6xl font-mono text-orange-400 lg:mx-20 my-6 lg:my-12 text-center">
                Setup Express Server
            </p>

            {/* input box */}
            <p className='mt-10 font-mono font-bold text-orange-400 text-center'>Enter Your DB Name</p>
            <div className="lg:mx-[450px] mt-5 flex">
                <form onChange={(e) => setProjectName(packageNameCorrector(e.target.value))}
                      className="flex flex-col lg:flex-row justify-center lg:justify-start gap-4 lg:gap-10 w-full">
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <input
                            type="text"
                            className="w-full"
                            placeholder="DB Name"
                            name="name"
                        />
                        <GoDatabase />
                    </label>
                </form>
            </div>

            {/* command */}
            <div className='my-10'>
                <form>
                    <ul className="grid w-full gap-6 md:grid-cols-6">
                        <li>
                            <input onClick={() => setExpress(!useExpress)} type="checkbox" id="router-option" value=""
                                   className="hidden peer" required=""></input>
                            <label htmlFor="router-option"
                                   className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-700/50 border-0 peer-checked:border-2 shadow-xl border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 ">
                                <div className="flex flex-col gap-2 items-center justify-center w-full">
                                    <img className='w-7 h-7 fill-current text-green-600' src="ex.svg" alt="router"/>
                                    <div className="w-full text-lg font-semibold font-mono text-center">Express
                                    </div>
                                </div>
                            </label>
                        </li>



                        <li>
                            <input onClick={() => setNodemon(!useNodemon)} type="checkbox" id="tailwind-option"
                                   value="" className="hidden peer" required=""></input>
                            <label htmlFor="tailwind-option"
                                   className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-700/50 border-0 peer-checked:border-2 shadow-xl border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50 ">
                                <div className="flex flex-col gap-2 items-center justify-center w-full">
                                    <img className='w-7 h-7' src="nodemon.svg" alt="tailwindcss"/>
                                    <div className="w-full text-lg font-semibold font-mono text-center">Nodemon</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input onClick={() => setStripe(!useStripe)} type="checkbox" id="react-option" value=""
                                   className="hidden peer" required=""></input>
                            <label htmlFor="react-option"
                                   className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-700/50 border-0 peer-checked:border-2 shadow-xl border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 ">
                                <div className="flex flex-col gap-2 items-center justify-center w-full">
                                    <img className='h-7' src="stripe.svg" alt=""/>
                                    <div className="w-full text-lg font-semibold font-mono text-center">Stripe</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input onClick={() => setJwt(!useJwt)} type="checkbox" id="flowbite-option"
                                   value="" className="hidden peer"></input>
                            <label htmlFor="flowbite-option"
                                   className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-700/50 border-0 peer-checked:border-2 shadow-xl border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 ">
                                <div className="flex flex-col gap-2 items-center justify-center w-full">
                                    <img className='h-7 w-7'
                                         src="jwt.svg"
                                         alt="firebase"/>
                                    <div className="w-full text-lg font-semibold font-mono text-center">JWT</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input onClick={() => setVercel(!useVercel)} type="checkbox" id="angular-option"
                                   value="" className="hidden peer"></input>
                            <label htmlFor="angular-option"
                                   className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-700/50 border-0 peer-checked:border-2 shadow-xl border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 ">
                                <div className="flex flex-col gap-2 items-center justify-center w-full">
                                    <img width="28" height="28" src="vercel.svg"
                                         alt="toast"/>
                                    <div className="w-full text-lg font-semibold font-mono text-center">Vercel</div>
                                </div>
                            </label>
                        </li>
                        <li>
                            <input onClick={() => setDeploy(!useDeploy)} type="checkbox" id="reactIcons-option" value=""
                                   className="hidden peer"></input>
                            <label htmlFor="reactIcons-option"
                                   className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-700/50 border-0 peer-checked:border-2 shadow-xl border-gray-200 rounded-lg cursor-pointer  peer-checked:border-blue-600 hover:text-gray-600  peer-checked:text-gray-600 hover:bg-gray-50 ">
                                <div className="flex flex-col gap-2 items-center justify-center w-full">
                                    <img width="28" height="28" src="deploy.png" alt="react-icons"/>
                                    <div className="w-full text-lg font-semibold font-mono text-center">Deploy</div>
                                </div>
                            </label>
                        </li>

                    </ul>
                </form>
            </div>



            <div className='my-10'>
                <h1 className='font-bold text-2xl text-center w-full font-mono text-orange-400'>NPM Packages</h1>
                <p className='font-mono font-medium mb-10 text-center'>
                    Elevate Your Server with Essential NPM Packages
                </p>
                <div className="lg:mx-[300px] border border-zinc-700  bg-slate-800 rounded-xl shadow-lg">

                    <div className="relative flex text-slate-400 text-xs leading-6 bg-slate-800 rounded-xl shadow-lg ">
                        <div
                            className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                            Commands
                        </div>
                        <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                            <div
                                className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                        </div>
                        <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                            <div className="relative flex -mr-2">
                                <button
                                    type="button"
                                    className="text-slate-500 hover:text-slate-400 "
                                    data-tip="copied"
                                    id="command-btn"
                                    onClick={() => copyToClipboard('command', 'command-btn')}
                                >
                                    <svg
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                        className="w-8 h-8"
                                    >
                                        <path
                                            d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                        <path
                                            d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className=" text-left p-5 text-zinc-300" id="command">
            <pre data-prefix="1" className="">
              <code className='text-balance'>
                  mkdir {projectName}
              </code>
            </pre>
                        <pre data-prefix="2" className="">
              <code className='text-balance'>cd {projectName}</code>
            </pre>

            <pre data-prefix="3" className="">
                <code className='text-balance'>
                    npm init -y
                </code>
            </pre>
                        {
                            useExpress && <pre data-prefix="4" className="">
                  <code className='text-balance'>npm i express mongodb cors nodemon dotenv</code>
            </pre>
                        }
                        {
                            useStripe && <pre data-prefix="5" className="">
                <code className='text-balance'>
                  npm install --save stripe
                </code>
              </pre>
                        }
                        {
                            useJwt && <pre data-prefix="6" className="">
                <code className='text-balance'>npm install jsonwebtoken</code>
              </pre>
                        }
                        {
                            useNodemon && <pre data-prefix="7" className="">
                <code className='text-balance'>nodemon index.js</code>
              </pre>
                        }
                        {
                            useVercel && <pre data-prefix="8" className="">
                <code className='text-balance'>npm i -g vercel</code>
              </pre>
                        }
                        {
                            useDeploy && <pre data-prefix="8" className="">
                <code className='text-balance'> <br/>vercel</code>
              </pre>
                        }
                    </div>
                </div>
            </div>




            {/* tailwind.config.js  */}
            {
                useNodemon && <>
                    <div className="lg:mx-[300px]">
                        <h1 className='font-bold text-2xl text-center w-full font-mono text-orange-400'>Nodemon
                            Configuration</h1>
                        <p className='font-mono font-medium text-center'>
                            Auto Start node index.js file
                        </p>
                        <div
                            className="text-left relative my-10 z-10 lg:-ml-10 col-span-3 bg-slate-800 rounded-xl shadow-lg xl:ml-0 ">
                            <div className="relative flex text-slate-400 text-xs leading-6">
                                <div
                                    className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                                    package.json
                                </div>
                                <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                                    <div
                                        className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                                </div>
                                <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                                    <div className="relative flex -mr-2">
                                        <button
                                            type="button"
                                            className="text-slate-500 hover:text-slate-400 "
                                            data-tip="copied"
                                            id="package-json-btn"
                                            onClick={() =>
                                                copyToClipboard('package-json', 'package-json-btn')
                                            }
                                        >
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                                className="w-8 h-8"
                                            >
                                                <path
                                                    d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                                <path
                                                    d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
              <pre className="text-sm leading-6 text-slate-50 flex ligatures-none overflow-auto">
                <code className="flex-none min-w-full p-5" id="package-json">

                  <span className="token block">
                    <span className="token plain"></span>
                    <span className="token keyword module">&quot;scripts&quot;: </span>
                    <span className="token plain"> </span>
                    <span className="token punctuation">&#123;</span>
                    <span className="token plain"></span>
                  </span>
                  <span className="token block -mx-5 pl-4 pr-5 border-l-4 border-sky-400 bg-sky-300/[0.15]">
                    <span className="token plain"> </span>
                    <span className="token literal-property property">
                      &quot;start&quot;
                    </span>
                    <span className="token operator">:</span>
                    <span className="token plain"> </span>
                    <span className="token punctuation">&quot;node index.js&quot;,
                    </span>
                    <span className="token plain"></span>
                  </span>

                  <span className="token block">
                    <span className="token plain"> </span>
                    <span className="token literal-property property"> &quot;test&quot; </span>
                    <span className="token operator">:</span>
                    <span className="token plain"> </span>
                    <span className="token punctuation">&quot;echo \&quot;Error: no test specified\&quot; && exit 1&quot;</span>
                    <span className="token plain"></span>
                  </span>
                    <span className="token block">
                    <span className="token plain"></span>
                    <span className="token punctuation">&#125;</span>
                  </span>
                </code>
              </pre>
                            </div>
                        </div>
                    </div>

                </>
            }

            {
                useJwt && <>
                    <div className="lg:mx-[300px]">
                        <h1 className='font-bold text-2xl text-center w-full font-mono text-orange-400'>Generate JWT Token
                           </h1>
                        <p className='font-mono font-medium text-center'>
                            Generate Token with node command
                        </p>
                        <div
                            className="text-left relative my-10 z-10 lg:-ml-10 col-span-3 bg-slate-800 rounded-xl shadow-lg xl:ml-0 ">
                            <div className="relative flex text-slate-400 text-xs leading-6">
                                <div
                                    className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                                    node
                                </div>
                                <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                                    <div
                                        className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                                </div>
                                <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                                    <div className="relative flex -mr-2">
                                        <button
                                            type="button"
                                            className="text-slate-500 hover:text-slate-400 "
                                            data-tip="copied"
                                            id="node-btn"
                                            onClick={() =>
                                                copyToClipboard('node', 'node-btn')
                                            }
                                        >
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                                className="w-8 h-8"
                                            >
                                                <path
                                                    d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                                <path
                                                    d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
              <pre className="text-sm leading-6 text-slate-50 flex ligatures-none overflow-auto">
                <code className="flex-none min-w-full p-5" id="node">

                  <span className="token block">
                    <span className="token plain"></span>
                    <span className="token keyword module">require(&apos;crypto&apos;).randomBytes(64).toString(&apos;hex&apos;) </span>
                    <span className="token plain"></span>
                  </span>
                </code>
              </pre>
                            </div>
                        </div>
                    </div>

                </>
            }

            {/* vercel.json */}
            {
                useVercel && <>
                    <div className='my-10'>
                        <h1 className='font-bold text-2xl text-center w-full font-mono text-orange-400'>Vercel
                            Integration</h1>
                        <p className='font-mono font-medium text-center'>
                            Seamlessly serve index
                            Page
                        </p>
                    </div>
                    <div
                        data-code-block=""
                        data-filename="src/main.jsx"
                        data-line-numbers="true"
                        data-lang="jsx"
                        className="text-left bg-slate-800 rounded-xl lg:mx-[300px]  text-zinc-300"
                    >

                        <div className="relative flex text-slate-400 text-xs leading-6 w-full">
                            <div
                                className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                                vercel.json
                            </div>
                            <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                                <div
                                    className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                            </div>
                            <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                                <div className="relative flex -mr-2">
                                    <button
                                        type="button"
                                        id="vercel-btn"
                                        data-tip="copied"
                                        className="text-slate-500 hover:text-slate-400"
                                        onClick={() => copyToClipboard('vercel', 'vercel-btn')}
                                    >
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                            className="w-8 h-8"
                                        >
                                            <path
                                                d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                            <path
                                                d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <pre
                            data-filename="src/main.jsx"
                            data-line-numbers="true"
                            data-lang="jsx"
                            className="p-5"
                        >
              <code className='break-words text-balance' id="vercel">
                  {`{
    "version": 2,
    "builds": [
        {
            "src": "index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/",
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        }
    ]
}`}
              </code>
            </pre>
                    </div>
                </>
            }

            {/* deploy */}
            {
                useDeploy && <>
                    <div className='my-10'>
                        <h1 className='font-bold text-2xl text-center w-full font-mono text-orange-400'>
                            Deploy In Vercel
                        </h1>
                        <p className='font-mono font-medium text-center'>Deploy Using Vercel CLI</p>
                    </div>
                    <div
                        data-code-block=""
                        data-filename="MyComponent.jsx"
                        data-line-numbers="true"
                        data-lang="jsx"
                        className="text-left bg-slate-800 rounded-xl lg:mx-[300px]  text-zinc-300"
                    >

                        <div className="relative flex text-slate-400 text-xs leading-6 w-full">
                            <div
                                className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                                Terminal
                            </div>
                            <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                                <div
                                    className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                            </div>
                            <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                                <div className="relative flex -mr-2">
                                    <button
                                        type="button"
                                        id="deploy-btn"
                                        data-tip="copied"
                                        className="text-slate-500 hover:text-slate-400"
                                        onClick={() => copyToClipboard('deploy', 'deploy-btn')}
                                    >
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                            className="w-8 h-8"
                                        >
                                            <path
                                                d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                            <path
                                                d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <pre
                            data-filename="deploy"
                            data-line-numbers="true"
                            data-lang="jsx"
                            className="p-5"
                        >
              <code className='break-words text-balance' id="deploy">
                <span>
                  <pre className='whitespace-pre-wrap'>
                    <code>{`Vercel --prod
y
n
Enter
./`}</code>
                  </pre>
                </span>
              </code>
            </pre>
                    </div>
                </>
            }

            {/* Main Template code*/}
            {
                useExpress && <>
                    <div className='my-10'>
                        <h1 className='font-bold text-2xl text-center w-full font-mono text-orange-400'>
                            Express, CORS, MongoDB Integration
                        </h1>
                        <p className='font-mono font-medium text-center'>Template Code</p>
                    </div>
                    <div
                        data-code-block=""
                        data-filename="index.js"
                        data-line-numbers="true"
                        data-lang="jsx"
                        className="text-left bg-slate-800 rounded-xl text-zinc-300"
                    >

                        <div className="relative flex text-slate-400 text-xs leading-6 w-full">
                            <div
                                className="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">
                                index.js
                            </div>
                            <div className="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                                <div
                                    className="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                            </div>
                            <div className="absolute top-2 right-0 h-8 flex items-center pr-4">
                                <div className="relative flex -mr-2">
                                    <button
                                        type="button"
                                        id="MyComponent-jsx-btn"
                                        data-tip="copied"
                                        className="text-slate-500 hover:text-slate-400"
                                        onClick={() => copyToClipboard('index-js', 'MyComponent-jsx-btn')}
                                    >
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                            className="w-8 h-8"
                                        >
                                            <path
                                                d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                            <path
                                                d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <pre
                            data-filename="index.js"
                            data-line-numbers="true"
                            data-lang="jsx"
                            className="p-5"
                        >
              <code className='break-words text-balance' id="index-js">
                <span>
                  <pre className='whitespace-pre-wrap'>
                    <code>
                        <CodeSnippet codeString={codeString} />
                    </code>
                  </pre>
                </span>
              </code>
            </pre>
                    </div>
                </>
            }

        </div>
    );
};

export default Server;