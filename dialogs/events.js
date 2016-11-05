module.exports = function () {
    bot.dialog('/sessions', [
        function (session) {
            if (session.message.source === "skype") {
                builder.Prompts.choice(session, "What day are you interested in?", ['Monday 11/7', 'Tuesday 11/8', 'Wednesday 11/9'], { listStyle: builder.ListStyle.button });
            } else {
                builder.Prompts.choice(session, "What day are you interested in?", ['Monday 11/7', 'Tuesday 11/8', 'Wednesday 11/9']);
            }
        },
        function (session, results) {
            if (results.response) {
                var selection = results.response.entity.split(" ");
                var Day = selection[0];

                getTrackFacets(Day, function (err, results) {
                    if (err) {

                    } else if (results && results[0] && results[0]['value']) {
                        var choices = [];
                        session.privateConversationData.tracksWithChildren = [];
                        for (var i = 0; i < results.length; i++) {
                            var track = results[i]['value'];
                            if (!track.endsWith("Child") && track !== "" && track !== "lunch") {
                                choices.push(track);
                            } else {
                                session.privateConversationData.tracksWithChildren.push(track.substring(0, track.length - 6))
                            }
                        }

                        session.privateConversationData.Day = Day;
                        session.privateConversationData.facets = choices;
                        if (session.message.source === "skype") {
                            builder.Prompts.choice(session, "Which track are you interested in on " + Day + "?", choices, { listStyle: builder.ListStyle.button });
                        } else {
                            builder.Prompts.choice(session, "Which track are you interested in on " + Day + "?", choices);
                        }
                    } else {
                        session.send("I wasn't able to find any events on that day :0");
                    }
                })
            }
        },
        function (session, results) {
            if (results.response) {
                var choice = results.response.entity;
                getEventsByTrack(choice, session.privateConversationData.Day, function (err, results) {
                    if (err) {
                    } else if (results) {
                        session.privateConversationData.queryResults = results;
                        session.privateConversationData.searchType = "event";
                        if (trackHasChildren(session, choice)) {
                            getEventsByTrack(choice + " Child", session.privateConversationData.Day, function (err, results) {
                                if (err) {
                                } else if (results) {
                                    var parent = session.privateConversationData.queryResults;
                                    session.privateConversationData.queryResults = parent.concat(results);
                                }
                                session.replaceDialog('/ShowResults')
                            })
                        } else {
                            session.replaceDialog('/ShowResults')
                        }
                    } else {
                        session.endDialog();
                    }

                })

            }
        },
    ]);

    bot.dialog('/querySessions', [
        function (session) {
            if (session.privateConversationData.Track) {
                var choice = session.privateConversationData.Track;
                getEventsByTrack(choice, session.privateConversationData.Day, function (err, results) {
                    if (err) {
                    } else if (results) {
                        session.privateConversationData.queryResults = results;
                        session.privateConversationData.searchType = "event";
                        if (trackHasChildren(session, choice)) {
                            getEventsByTrack(choice + " Child", session.privateConversationData.Day, function (err, results) {
                                if (err) {
                                } else if (results) {
                                    var parent = session.privateConversationData.queryResults;
                                    session.privateConversationData.queryResults = parent.concat(results);
                                }
                                session.replaceDialog('/ShowResults')
                            })
                        } else {
                            session.replaceDialog('/ShowResults')
                        }
                    } else {
                        session.endDialog();
                    }

                })
            } else {
                session.send("Not sure what track you're looking for there!")
            }
        }
    ])
}