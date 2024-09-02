"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

export function ModernTwitterClone() {
	const [tweets, setTweets] = useState<
		{
			id: number;
			content: string;
			likes: number;
			comments: number;
			retweets: number;
			username: string;
			avatar: string;
		}[]
	>([]);
	const [newTweet, setNewTweet] = useState("");
	const username = "maobushi";

	const handlePostTweet = async () => {
		if (newTweet.trim() !== "") {
			const tweet = {
				id: `${username}-${tweets.length + 1}`,
				content: newTweet,
				likes: 0,
				comments: 0,
				retweets: 0,
				username: username,
				avatar: `/maobushi.png`,
			};
			setTweets([tweet, ...tweets]);
			setNewTweet("");

			const users = [
				{
					name: "wasabijiro",
					personality:
						"cryptoのとても強いエンジニア。たまに技術的なアドバイスをくれる。ツイートに対しては冷静に、一言呟くのみ。例:すごいじゃん。",
					avatar: "/wasabijiro.png",
				},
				{
					name: "uoooo",
					personality:
						"ツイッターの達人。いつも面白いツイートをしている。経済学に関する観点から、経済学の専門的な知識を引用してツイート反応してくれる。「つまり結論は飲み会ってことか」が口癖。例:笑った。",
					avatar: "/uoooo.png",
				},
				{
					name: "konaito",
					personality:
						"アプリエンジニア。いつも新しいアプリを作っている。ツイートに対しては、アプリのアイディアを提案してくれる。優しい。例:これアプリ化したら面白いんじゃない？",
					avatar: "/konaito.png",
				},
				{
					name: "fuyutarow",
					personality:
						"エンジニアの専門家。とても高い技術力と、市場に対する洞察力を保持している。また、エンジニアリングに強いこだわりがあり、アカデミックな知識を重視する。とても辛辣な反応をするが、的を得たツイートをすると正しく評価してくれる。",
					avatar: "/fuyutarow.png",
				},
			];

			for (const user of users) {
				const response = await fetch("/api/openai", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						systemMessage: `You are a ${user.personality} person.`,
						userMessage: newTweet,
					}),
				});

				const data = await response.json();
				const reply = data.message.content;
				const replyTweet = {
					id: `${user.name}-${tweets.length + 1}`,
					content: `${reply}`,
					likes: 0,
					comments: 0,
					retweets: 0,
					username: user.name,
					avatar: user.avatar,
				};
				setTweets((prevTweets) => [replyTweet, ...prevTweets]);
			}
		}
	};

	const handleLike = (id: any) => {
		setTweets(
			tweets.map((tweet) =>
				tweet.id === id ? { ...tweet, likes: tweet.likes + 1 } : tweet
			)
		);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 p-4">
			<Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
				<CardContent className="p-6">
					<h1 className="text-2xl font-bold mb-6 text-white">Modern X Clone</h1>
					<div className="space-y-6">
						<div className="flex space-x-4">
							<Avatar className="w-12 h-12">
								<AvatarImage src={`/maobushi.png`} />
								<AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-2">
								<Textarea
									placeholder="What's happening?"
									value={newTweet}
									onChange={(e) => setNewTweet(e.target.value)}
									className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
								/>
								<Button
									onClick={handlePostTweet}
									className="bg-blue-500 hover:bg-blue-600 transition-colors"
								>
									Tweet
								</Button>
							</div>
						</div>
						<ScrollArea className="h-max pr-4">
							{tweets.map((tweet) => (
								<Card
									key={tweet.id}
									className="mb-4 bg-gray-700 border-gray-600 overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg"
								>
									<CardContent className="p-4">
										<div className="flex space-x-4">
											<Avatar className="w-10 h-10">
												<AvatarImage src={tweet.avatar} />
												<AvatarFallback>
													{tweet.username[0].toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 space-y-1">
												<p className="font-semibold text-white">
													@{tweet.username}
												</p>
												<p className="text-gray-300">{tweet.content}</p>
												<div className="flex space-x-4 mt-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleLike(tweet.id)}
														className="text-gray-400 hover:text-red-500 transition-colors"
													>
														<Heart className="w-4 h-4 mr-1" />
														{tweet.likes}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-gray-400 hover:text-blue-500 transition-colors"
													>
														<MessageCircle className="w-4 h-4 mr-1" />
														{tweet.comments}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-gray-400 hover:text-green-500 transition-colors"
													>
														<Repeat2 className="w-4 h-4 mr-1" />
														{tweet.retweets}
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-gray-400 hover:text-blue-500 transition-colors"
													>
														<Share className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</ScrollArea>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
