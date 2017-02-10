'use strict';

interpolate('pluralize_##_{"one":"You have %{count} like.","other":"You have %{count} likes."}', { count: 0 });

console.log(interpolate('Not pluralized %{count}', { count: 1 }));
